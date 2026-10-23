# Booked & Obsessed

*for readers who feel too much*

Reading companion da Kassi: Library com status e coleções, ficha de cada livro e busca de edições e capas no Google Books.

- Site estático (HTML, CSS e JavaScript, sem build), publicado pelo GitHub Pages.
- Dados e login no Supabase. Cada conta só enxerga os próprios livros (Row Level Security).
- A chave no `app.js` é a chave pública (anon) do Supabase, feita para ficar no navegador.

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```
python3 -m http.server 8000
```

e abra http://localhost:8000.
