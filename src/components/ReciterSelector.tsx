import { reciters } from '@/data/surahs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2 } from 'lucide-react';

interface ReciterSelectorProps {
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export function ReciterSelector({ reciterId, onReciterChange }: ReciterSelectorProps) {
  const currentReciter = reciters.find(r => r.id === reciterId);

  return (
    <Select value={reciterId} onValueChange={onReciterChange}>
      <SelectTrigger className="w-auto gap-2 bg-secondary/50 border-0 text-sm">
        <Volume2 className="w-4 h-4" />
        <SelectValue>
          {currentReciter?.name || 'اختر القارئ'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {reciters.map(reciter => (
          <SelectItem key={reciter.id} value={reciter.id}>
            <span className="font-arabic">{reciter.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
