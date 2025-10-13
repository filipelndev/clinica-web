
Projeto: site estático para psicóloga

Arquivos principais:
- `index.html` — página inicial
- `about.html` — página sobre a profissional
- `agenda.html` — página com agenda interativa (usa localStorage)
- `contact.html` — formulário de contato (mock)
- `css/styles.css` — estilos
- `js/main.js` — scripts

Como testar localmente:
- Abrir os arquivos HTML diretamente no navegador (recomendado usar servidor local para evitar restrições do localStorage em alguns navegadores).
- Com Node.js: rode um servidor simples (ex: `npx http-server .` ou `python -m http.server 8000`)

Atualizações nesta versão:
- Paleta de cores refinada e melhorias de espaçamento para uma estética mais profissional.
- Reformulação do CSS para melhorar consistência (tipografia, containers, cards e formulários).
- Formulário de contato reformatado com layout em colunas (desktop) e empilhado em mobile; textarea agora tem tamanho fixo e não é redimensionável.
- Agenda: cada evento agora tem um botão "Adicionar ao Google Calendar" que abre o formulário de criação do evento no Google Calendar com título, data/hora e descrição preenchidos. Isto cria um evento no calendário do usuário a partir do navegador; para sincronização completa é necessário um backend com OAuth e uso da Google Calendar API.

Melhorias sugeridas (próximos passos):
- Implementar backend para sincronização com Google Calendar (OAuth 2.0) e armazenamento central de consultas.
- Conectar formulário de contato a serviço de envio de e-mail (Formspree, Getform) ou implementar endpoint (Node/Express + nodemailer).
- Otimização de SEO: meta tags, Open Graph, JSON-LD (schema.org/Therapist ou MedicalOrganization).
- Acessibilidade: teste com leitores de tela, contraste, navegação por teclado e atributos ARIA completos.
- Identidade visual: adicionar logotipo SVG, tipografia externa e imagens autorais.

Como funciona a integração com Google Calendar (atual):
- O botão "Adicionar ao Google Calendar" gera um link para `https://www.google.com/calendar/render?action=TEMPLATE...` com parâmetros preenchidos (título, descrição, datas). O usuário final confirma a criação do evento no Google Calendar.
- Limitação: não há sincronização automática — cada usuário adiciona o evento no próprio calendário. Para integração automatizada (criar/sincronizar eventos automaticamente) é necessário um backend com OAuth.

Se quiser, eu posso:
- Implementar um backend simples (Node/Express) e um exemplo de fluxos OAuth para Google Calendar.
- Conectar o formulário de contato a Formspree rapidamente (apenas trocar a `action` do form).
- Ajustar a identidade visual com paleta e fontes que você escolher.

----
Feito por: scaffold inicial e melhorias visuais/funcionais.
