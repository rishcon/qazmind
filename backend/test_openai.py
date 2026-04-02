import asyncio
from openai import AsyncOpenAI
from app.core.config import settings

async def test():
    print(f"Testing OpenAI with key: {settings.OPENAI_API_KEY[:20]}...")
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say hello"}],
            max_tokens=10
        )
        print("✓ Success!")
        print(f"Response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"✗ Error: {type(e).__name__}")
        print(f"Message: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test())
