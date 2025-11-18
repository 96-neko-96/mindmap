import { useMindMap } from '../context/MindMapContext';
import { translations } from '../utils/translations';
import type { TranslationKey } from '../utils/translations';

export function useTranslation() {
  const { mindMap } = useMindMap();

  const t = (key: TranslationKey): string => {
    return translations[mindMap.language][key] || key;
  };

  return { t, language: mindMap.language };
}
