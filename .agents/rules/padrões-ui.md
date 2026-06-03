---
trigger: always_on
---

# Padrões de UI do Frontend

## Inputs com Ícones (Formulários)

Para campos de formulário que têm ícone à esquerda dentro do campo, usar:

```tsx
<div className="relative">
  <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
  <input
    className="input"
    style={{ paddingLeft: "2.5rem" }}
  />
</div>
```

Isso corresponde a:
- Ícone: `left-3` (12px) + `w-4 h-4` (16px)
- Input: `padding-left: 2.5rem` (40px)

Essa configuração garante ~28px de espaço entre o ícone e o início do texto, evitando sobreposição.

**Exemplo real:**
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email *</label>
  <div className="relative">
    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
    <input
      type="email"
      name="email"
      className="input"
      style={{ paddingLeft: "2.5rem" }}
    />
  </div>
</div>
```

## Buscas/Search Inputs

Para campos de busca (onde o ícone é o único elemento à esquerda), usar:
```tsx
<div className="relative">
  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
  <input className="input pl-9" />
</div>
```

Esse padrão já funciona bem porque o input é mais largo e comporta o ícone com pl-9.