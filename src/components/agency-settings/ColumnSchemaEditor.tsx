import { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDefinition, ColumnType, ColumnWidth, SelectOption } from "@/hooks/useColumnSchemas";
import { SYSTEM_COLUMN_KEYS } from "@/hooks/useColumnSchemas";

interface Props {
  columns: ColumnDefinition[];
  onChange: (columns: ColumnDefinition[]) => void;
  readOnly?: boolean;
}

const TYPE_LABELS: Record<ColumnType, string> = {
  text: "Text",
  number: "Number",
  currency: "Currency",
  date: "Date",
  select: "Dropdown",
  boolean: "Yes/No",
};

const WIDTH_LABELS: Record<ColumnWidth, string> = {
  compact: "Compact",
  normal: "Normal",
  wide: "Wide",
};

const SYSTEM_KEY_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const slugify = (label: string) =>
  label
    .trim()
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/^[^a-zA-Z]/, "c");

export function ColumnSchemaEditor({ columns, onChange, readOnly = false }: Props) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const sorted = [...columns].sort((a, b) => a.order - b.order);

  const update = (key: string, patch: Partial<ColumnDefinition>) => {
    onChange(
      columns.map((col) => (col.key === key ? { ...col, ...patch } : col))
    );
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = sorted.map((c) => ({ ...c }));
    [next[idx - 1].order, next[idx].order] = [next[idx].order, next[idx - 1].order];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx === sorted.length - 1) return;
    const next = sorted.map((c) => ({ ...c }));
    [next[idx].order, next[idx + 1].order] = [next[idx + 1].order, next[idx].order];
    onChange(next);
  };

  const addColumn = () => {
    const maxOrder = Math.max(0, ...columns.map((c) => c.order));
    const newKey = `custom_${Date.now()}`;
    const newCol: ColumnDefinition = {
      key: newKey,
      label: "New Column",
      type: "text",
      order: maxOrder + 1,
      active: true,
      width: "normal",
    };
    onChange([...columns, newCol]);
    setExpandedKey(newKey);
  };

  const removeColumn = (key: string) => {
    onChange(columns.filter((c) => c.key !== key));
    if (expandedKey === key) setExpandedKey(null);
  };

  const updateOption = (key: string, idx: number, field: "value" | "label", val: string) => {
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    const options = [...(col.options ?? [])];
    options[idx] = { ...options[idx], [field]: val };
    update(key, { options });
  };

  const addOption = (key: string) => {
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    update(key, { options: [...(col.options ?? []), { value: "", label: "" }] });
  };

  const removeOption = (key: string, idx: number) => {
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    const options = (col.options ?? []).filter((_, i) => i !== idx);
    update(key, { options });
  };

  return (
    <div className="space-y-1">
      {sorted.map((col, idx) => {
        const isSystem = SYSTEM_COLUMN_KEYS.has(col.key);
        const isExpanded = expandedKey === col.key;

        return (
          <div
            key={col.key}
            className={`rounded-lg border transition-colors ${
              col.active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"
            }`}
          >
            {/* Row summary */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              {/* Order controls */}
              {!readOnly && (
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sorted.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />

              {/* Label */}
              <div className="flex-1 min-w-0">
                {readOnly ? (
                  <span className="text-sm font-medium">{col.label}</span>
                ) : (
                  <Input
                    value={col.label}
                    onChange={(e) => {
                      // Only update label while typing — do NOT update col.key here,
                      // because col.key is used as the React list key and changing it
                      // on every keystroke causes the element to remount (losing focus).
                      update(col.key, { label: e.target.value });
                    }}
                    onBlur={(e) => {
                      // Derive a stable identifier from the final label only on blur.
                      if (!isSystem) {
                        const slug = slugify(e.target.value);
                        if (slug && SYSTEM_KEY_RE.test(slug)) {
                          update(col.key, { key: slug });
                        }
                      }
                    }}
                    className="h-7 text-sm border-none shadow-none bg-transparent p-0 focus-visible:ring-0 font-medium"
                    placeholder="Column name"
                  />
                )}
              </div>

              {/* Type badge */}
              <Badge variant="secondary" className="text-[10px] hidden sm:flex shrink-0">
                {TYPE_LABELS[col.type]}
              </Badge>

              {/* System badge */}
              {isSystem && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[10px] shrink-0 cursor-default">
                      system
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>This is a system column. You can rename it or hide it, but not delete it.</TooltipContent>
                </Tooltip>
              )}

              {/* Active toggle */}
              {!readOnly && (
                <Switch
                  checked={col.active}
                  onCheckedChange={(v) => update(col.key, { active: v })}
                  className="shrink-0"
                />
              )}

              {/* Expand / delete */}
              {!readOnly && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setExpandedKey(isExpanded ? null : col.key)}
                  >
                    <span className="text-xs text-muted-foreground">{isExpanded ? "▲" : "▼"}</span>
                  </Button>
                  {!isSystem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeColumn(col.key)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Expanded config */}
            {isExpanded && !readOnly && (
              <div className="border-t border-border/50 px-4 py-3 space-y-3 bg-muted/20">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Type */}
                  {!isSystem && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Type</label>
                      <Select
                        value={col.type}
                        onValueChange={(v) => update(col.key, { type: v as ColumnType })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(TYPE_LABELS) as ColumnType[]).map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">
                              {TYPE_LABELS[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Width */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Width</label>
                    <Select
                      value={col.width ?? "normal"}
                      onValueChange={(v) => update(col.key, { width: v as ColumnWidth })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(WIDTH_LABELS) as ColumnWidth[]).map((w) => (
                          <SelectItem key={w} value={w} className="text-xs">
                            {WIDTH_LABELS[w]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Required */}
                  {!isSystem && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Required</label>
                      <div className="flex items-center h-8">
                        <Switch
                          checked={col.required ?? false}
                          onCheckedChange={(v) => update(col.key, { required: v })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown options (for select type) */}
                {col.type === "select" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Dropdown options</label>
                    {(col.options ?? []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <Input
                          value={opt.label}
                          onChange={(e) => updateOption(col.key, oi, "label", e.target.value)}
                          placeholder="Label"
                          className="h-7 text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                          onClick={() => removeOption(col.key, oi)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => addOption(col.key)}
                    >
                      <Plus className="w-3 h-3" />
                      Add option
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!readOnly && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 mt-2"
          onClick={addColumn}
        >
          <Plus className="w-4 h-4" />
          Add column
        </Button>
      )}
    </div>
  );
}
