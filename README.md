# Bruno Despachante Veicular: site institucional

Site estático (HTML, CSS e JavaScript puro) para o Bruno Despachante Veicular, despachante credenciado no DETRAN-RJ em Realengo, Rio de Janeiro. Não usa build, framework nem banco de dados.

## Estrutura

```
bruno-despachante/
├── index.html                  Página única (todas as seções)
├── README.md                   Este arquivo
├── css/
│   └── style.css               Estilos, tokens de cor e tipografia
├── js/
│   ├── main.js                 Animações, abas, contadores e scroll da estrada
│   └── vendor/
│       ├── anime.min.js        anime.js 3.2.2 (licença MIT)
│       └── anime-LICENSE.md
└── img/
    ├── bruno.jpg               Foto do Bruno (414 x 570 px)
    ├── logo-mark.png           Marca "B" com pneu (máscara, usada em amarelo)
    └── logo-full.png           Logo completo (máscara, usada no rodapé)
```

## Como testar no computador

Abra por um servidor local, não clicando duas vezes no arquivo. Os logos são aplicados como máscara CSS, e o Chrome bloqueia esse recurso em `file://`.

```bash
cd bruno-despachante
python3 -m http.server 8000
# abra http://localhost:8000
```

## Como publicar

1. **GitHub Pages:** suba a pasta em um repositório, vá em *Settings > Pages* e escolha a branch `main` na raiz.
2. **Domínio próprio:** aponte o domínio para o GitHub Pages (arquivo `CNAME` ou configuração do provedor).
3. Depois de publicar, envie o site ao Google Search Console e crie/reivindique o Perfil da Empresa no Google com o mesmo endereço.

## O que editar

| O quê | Onde |
|---|---|
| Número do WhatsApp e mensagem padrão | `js/main.js`, objeto `CFG` no topo |
| Textos, serviços, FAQ, avaliações | `index.html` |
| Cores, fontes e espaçamentos | `css/style.css`, bloco `:root` (tokens) |
| Foto do Bruno | `img/bruno.jpg` (troque por uma versão em alta resolução) |
| Dados para o Google (nota, endereço, telefone) | `index.html`, bloco `application/ld+json` no `<head>` |

Os botões de WhatsApp usam `data-wa="mensagem"`. O JavaScript monta o link `wa.me` com o número de `CFG.wa` e a mensagem do atributo. Sem JavaScript, o link cai no atalho `wa.me/message/...` do Bruno.

## Confirmar com o cliente antes de publicar

- Se (21) 96460-7863 é o número do WhatsApp.
- Se "Aberto 24 horas" vale para o atendimento (vem do perfil do Google).
- Se ele aprova o texto em primeira pessoa ("Sou o Bruno...").
- Se as promessas da seção "Do WhatsApp ao documento na mão" refletem o jeito dele de trabalhar, principalmente o passo 2 (explicar documentos, prazo e valor antes de começar).
- Se as taxas do DETRAN e os honorários são mesmo cobrados separados (resposta do FAQ "Quanto custa?").
- Número de credenciamento, se ele quiser exibi-lo na seção de confiança.

## Detalhes de design

- **Estrada com scroll:** a linha tracejada amarela no cabeçalho enche conforme a rolagem. Na seção "Do WhatsApp ao documento na mão", um carrinho com a marca do pneu percorre a pista (anime.js `timeline` com `seek` ligado ao scroll) e acende cada etapa.
- **Hero:** abertura orquestrada em uma única sequência (linhas do título, foto com cortina e selo de nota). O mouse animado indica a rolagem, e o desenho de fundo se mexe levemente com o ponteiro.
- **Placa Mercosul:** a credencial "DETRAN·RJ" entra com efeito de carimbo ao aparecer na tela.
- **Faixa de pneu:** os chevrons do desenho do logo são gerados em SVG e se desenham ao entrar na tela.
- **Acessibilidade:** foco visível, navegação por teclado nas abas, `prefers-reduced-motion` respeitado (sem animações) e tema claro/escuro.

## Dependências externas

- Fontes: Archivo e Figtree, via Google Fonts (com fontes de reserva se falharem).
- anime.js 3.2.2 está incluído localmente em `js/vendor/`. Não depende de CDN.

## Créditos

Logo e foto: Bruno Despachante Veicular. anime.js: Julian Garnier, licença MIT.
