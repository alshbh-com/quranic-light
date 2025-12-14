import { useParams, Navigate } from 'react-router-dom';
import Index from './Index';

const SurahPage = () => {
  const { surahNumber } = useParams();
  const num = parseInt(surahNumber || '1', 10);

  // Validate surah number
  if (isNaN(num) || num < 1 || num > 114) {
    return <Navigate to="/" replace />;
  }

  // The Index component will handle the surah selection
  // We could enhance this to pass the surah number directly
  return <Index />;
};

export default SurahPage;
