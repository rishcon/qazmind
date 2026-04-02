import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';

const SubjectSelector = ({ isOpen, onClose, onComplete }) => {
  const { language } = useLanguageStore();
  const { token } = useAuthStore();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const requiredSubjects = ['История Казахстана', 'Математическая грамотность', 'Грамотность чтения'];

  useEffect(() => {
    if (isOpen && token) {
      loadSubjects();
      loadUserProfile();
    }
  }, [isOpen, token]);

  const loadSubjects = async () => {
    try {
      const response = await api.get('/subjects/');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await api.get('/profile/me');
      if (response.data.selected_subjects) {
        setSelectedSubjects(response.data.selected_subjects);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const toggleSubject = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const isRequired = (subjectName) => {
    return requiredSubjects.some(req => subjectName.includes(req));
  };

  const handleSave = async () => {
    if (selectedSubjects.length < 5) {
      alert(language === 'kz' 
        ? 'Кем дегенде 5 пән таңдаңыз (3 міндетті + 2 бейінді)' 
        : 'Выберите минимум 5 предметов (3 обязательных + 2 профильных)');
      return;
    }

    if (!token) {
      alert(language === 'kz' ? 'Алдымен кіріңіз' : 'Сначала войдите');
      return;
    }

    setSaving(true);
    try {
      await api.put('/profile/me', {
        selected_subjects: selectedSubjects
      });
      onComplete();
    } catch (error) {
      console.error('Error saving subjects:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const requiredSubjectsData = subjects.filter(s => isRequired(s.name_ru));
  const profileSubjectsData = subjects.filter(s => !isRequired(s.name_ru));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'kz' ? 'Пәндерді таңдаңыз' : 'Выберите предметы'}
          </h2>
          <p className="text-gray-600 mt-2">
            {language === 'kz' 
              ? 'ҰБТ-ға дайындалатын пәндеріңізді таңдаңыз. 3 міндетті + 2 бейінді пән' 
              : 'Выберите предметы для подготовки к ЕНТ. 3 обязательных + 2 профильных предмета'}
          </p>
          <div className="mt-3 text-sm text-indigo-600 font-medium">
            {language === 'kz' ? 'Таңдалды' : 'Выбрано'}: {selectedSubjects.length} / 5
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Обязательные предметы */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-red-500 mr-2">★</span>
                {language === 'kz' ? 'Міндетті пәндер' : 'Обязательные предметы'}
              </h3>
              <div className="space-y-2">
                {requiredSubjectsData.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => toggleSubject(subject.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center ${
                      selectedSubjects.includes(subject.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-3">{subject.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.questions_count} {language === 'kz' ? 'сұрақ' : 'вопросов'}
                      </div>
                    </div>
                    {selectedSubjects.includes(subject.id) && (
                      <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Профильные предметы */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'kz' ? 'Бейінді пәндер' : 'Профильные предметы'}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({language === 'kz' ? '2 таңдаңыз' : 'выберите 2'})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {profileSubjectsData.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => toggleSubject(subject.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-center ${
                      selectedSubjects.includes(subject.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-3">{subject.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.questions_count} {language === 'kz' ? 'сұрақ' : 'вопросов'}
                      </div>
                    </div>
                    {selectedSubjects.includes(subject.id) && (
                      <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            disabled={saving}
          >
            {language === 'kz' ? 'Бас тарту' : 'Отмена'}
          </button>
          <button
            onClick={handleSave}
            disabled={selectedSubjects.length < 5 || saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {saving 
              ? (language === 'kz' ? 'Сақтауда...' : 'Сохранение...') 
              : (language === 'kz' ? 'Сақтау' : 'Сохранить')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
