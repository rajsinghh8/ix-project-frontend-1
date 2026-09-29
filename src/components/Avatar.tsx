import { initials } from '../utils/format';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<Required<AvatarProps>['size'], string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
};

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold shrink-0 ${SIZE_CLASSES[size]}`}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
