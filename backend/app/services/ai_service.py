import json
from openai import AsyncOpenAI
from typing import List
import httpx

from app.core.config import settings

# Initialize OpenAI client lazily (when first needed)
_client = None

async def get_client() -> AsyncOpenAI:
    """Get or create OpenAI client"""
    global _client
    if _client is None:
        # Create httpx client without proxies parameter
        http_client = httpx.AsyncClient()
        _client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            http_client=http_client
        )
    return _client


async def generate_explanation(
    question_text: str,
    options: List[str],
    facts: str,
    user_answer: str,
    correct_answer: str,
    language: str
) -> str:
    """Generate AI explanation for wrong answer"""
    
    # Format options list
    options_list = "\n".join([f"{i+1}. {opt}" for i, opt in enumerate(options)])
    
    # Create prompt based on language
    prompt = f"""Ты — добрый и понимающий репетитор по истории Казахстана для подготовки к ҰБТ.

Тебе запрещено:
- выдумывать даты, имена, события или факты
- использовать знания вне предоставленных данных
- добавлять информацию, которой нет в QUESTION или FACTS

Используй ТОЛЬКО то, что есть ниже.

LANGUAGE: {language}

QUESTION:
{question_text}

OPTIONS:
{options_list}

FACTS (официальная справка из базы, источник истины):
{facts}

USER ANSWER:
{user_answer}

CORRECT ANSWER:
{correct_answer}

Твоя задача — доброжелательно объяснить ученику его ошибку так, чтобы он понял и запомнил правильный ответ.

ОБРАЩАЙСЯ К УЧЕНИКУ НАПРЯМУЮ (используй "ты", "твой"), будь поддерживающим и ободряющим.

Формат ответа:
Напиши один связный текст (2-4 предложения) в виде единого абзаца, где последовательно:
- Спокойно объясни, почему его ответ неверен (на основе FACTS)
- Покажи, почему правильный ответ — это именно тот вариант (на основе FACTS)
- Дай короткую подсказку для запоминания
- Добавь слова поддержки: "Не переживай", "Ты справишься", "Это важная тема" и т.д.

НЕ используй нумерованные списки (1), 2), 3)), НЕ разделяй на пункты — пиши как один плавный текст.

Если FACTS не содержат достаточно информации для объяснения — напиши:
"Недостаточно данных в справке для объяснения."
и ничего больше.
"""
    
    try:
        client = await get_client()
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "Ты — репетитор по истории Казахстана для ҰБТ."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=settings.AI_MAX_TOKENS,
            temperature=0.7
        )
        
        explanation = response.choices[0].message.content.strip()
        return explanation
        
    except Exception as e:
        import traceback
        print(f"❌ OpenAI Error: {type(e).__name__}")
        print(f"Message: {str(e)}")
        print(traceback.format_exc())
        
        # User-friendly error messages
        if "insufficient permissions" in str(e) or "Missing scopes" in str(e):
            raise Exception("OpenAI API ключ не имеет необходимых прав. Проверьте роль в организации (Owner/Member) на platform.openai.com")
        elif "401" in str(e) or "authentication" in str(e).lower():
            raise Exception("Неверный OpenAI API ключ. Проверьте ключ в настройках.")
        elif "insufficient_quota" in str(e) or "quota" in str(e).lower():
            raise Exception("Недостаточно средств на OpenAI аккаунте. Пополните баланс.")
        else:
            raise Exception(f"Ошибка AI сервиса: {str(e)}")


def _extract_json_object(raw_text: str) -> dict:
    text = raw_text.strip()

    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 3:
            text = "\n".join(lines[1:-1]).strip()

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("JSON object not found in AI response")

    return json.loads(text[start:end + 1])


async def generate_tutor_lesson(
    subject_name: str,
    topic: str,
    facts: str,
    language: str
) -> dict:
    prompt = f"""Ты — доброжелательный AI-репетитор для подготовки к ЕНТ.

Используй только предоставленные FACTS. Не выдумывай факты.
Если информации недостаточно, прямо скажи об этом в lesson_text и сделай простое общее задание по теме без ложных фактов.

LANGUAGE: {language}
SUBJECT: {subject_name}
TOPIC: {topic}

FACTS:
{facts}

Верни только JSON-объект без пояснений в таком формате:
{{
  "lesson_text": "краткий мини-урок простыми словами, 2-4 абзаца",
  "comparison_text": "краткое сравнение двух близких понятий по теме или 'Сравнение недоступно по данным'",
  "similar_questions": ["вопрос 1", "вопрос 2", "вопрос 3", "вопрос 4", "вопрос 5"],
  "assignment_prompt": "одно письменное задание для ученика на 4-8 предложений",
  "reference_answer": "эталонный ответ для внутренней проверки"
}}
"""

    client = await get_client()
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Ты — AI-репетитор для подготовки к ЕНТ. Возвращай только валидный JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max(settings.AI_MAX_TOKENS * 3, 900),
        temperature=0.5
    )

    content = response.choices[0].message.content or ""
    data = _extract_json_object(content)
    data["similar_questions"] = [str(item).strip() for item in data.get("similar_questions", []) if str(item).strip()][:5]
    while len(data["similar_questions"]) < 5:
        data["similar_questions"].append(f"{topic}: дополнительный вопрос {len(data['similar_questions']) + 1}")
    return data


async def review_student_answer(
    subject_name: str,
    topic: str,
    assignment_prompt: str,
    reference_answer: str,
    student_answer: str,
    language: str
) -> dict:
    prompt = f"""Ты — добрый, но требовательный AI-репетитор для подготовки к ЕНТ.

Проверь письменный ответ ученика.
Оцени по смыслу, полноте и точности, без придирок к мелкому стилю.
Если ответ частично верный, обязательно отметь сильные стороны.

LANGUAGE: {language}
SUBJECT: {subject_name}
TOPIC: {topic}

ASSIGNMENT:
{assignment_prompt}

REFERENCE_ANSWER:
{reference_answer}

STUDENT_ANSWER:
{student_answer}

Верни только JSON:
{{
  "feedback_text": "развернутая, поддерживающая проверка ответа ученика",
  "score": 0,
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "improvements": ["что улучшить 1", "что улучшить 2"],
  "model_answer": "улучшенный образец ответа"
}}
"""

    client = await get_client()
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Ты — AI-репетитор для подготовки к ЕНТ. Возвращай только валидный JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max(settings.AI_MAX_TOKENS * 3, 900),
        temperature=0.4
    )

    content = response.choices[0].message.content or ""
    data = _extract_json_object(content)
    data["score"] = max(0, min(100, int(data.get("score", 0))))
    data["strengths"] = [str(item).strip() for item in data.get("strengths", []) if str(item).strip()][:3]
    data["improvements"] = [str(item).strip() for item in data.get("improvements", []) if str(item).strip()][:3]
    return data
