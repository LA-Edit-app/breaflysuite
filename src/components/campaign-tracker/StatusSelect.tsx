import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  getStyle: (value: string) => string;
  placeholder?: string;
}

export function StatusSelect({
  value,
  onChange,
  options,
  getStyle,
  placeholder = "Select...",
}: StatusSelectProps) {
  return (
    <Select value={value || "_empty_"} onValueChange={(v) => onChange(v === "_empty_" ? "" : v)}>
      <SelectTrigger className="h-8 w-auto min-w-[100px] border-none bg-transparent hover:bg-muted/50 focus:ring-0">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <Badge className={cn(getStyle(value))}>{value}</Badge>
          ) : (
            <span className="text-muted-foreground/50">-</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_empty_">
          <span className="text-muted-foreground">None</span>
        </SelectItem>
        {options
          .map((o) => o.value === "" ? { ...o, value: o.label } : o)
          .filter((o) => o.value !== "")
          .map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge className={cn(getStyle(option.value))}>{option.label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
