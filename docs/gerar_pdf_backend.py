from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT = Path(__file__).resolve().parent.parent / "Correcoes_Backend_Manutencao.pdf"

NAVY = HexColor("#0F2C59")
TEAL = HexColor("#1B6B93")
SOFT = HexColor("#F4F7FB")
LINE = HexColor("#D5DEE8")
DARK = HexColor("#1E293B")
MUTED = HexColor("#475569")
CODE_BG = HexColor("#0F172A")
CODE_FG = HexColor("#E2E8F0")
WARN = HexColor("#9A3412")
OK = HexColor("#166534")


def build_styles():
    base = getSampleStyleSheet()
    styles = {
        "cover_kicker": ParagraphStyle(
            "cover_kicker",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            textColor=TEAL,
            spaceAfter=8,
            tracking=1,
        ),
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=32,
            textColor=NAVY,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=18,
            textColor=MUTED,
            spaceAfter=6,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=22,
            textColor=NAVY,
            spaceBefore=16,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=18,
            textColor=TEAL,
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=16,
            textColor=DARK,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=DARK,
            leftIndent=8,
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=10,
            leading=14,
            textColor=MUTED,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "code": ParagraphStyle(
            "code",
            fontName="Courier",
            fontSize=8.5,
            leading=12,
            textColor=CODE_FG,
            backColor=CODE_BG,
            leftIndent=6,
            rightIndent=6,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "th": ParagraphStyle(
            "th",
            fontName="Helvetica-Bold",
            fontSize=9,
            textColor=white,
            leading=12,
        ),
        "td": ParagraphStyle(
            "td",
            fontName="Helvetica",
            fontSize=9,
            textColor=DARK,
            leading=12,
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
        ),
        "file": ParagraphStyle(
            "file",
            fontName="Courier",
            fontSize=9,
            textColor=NAVY,
            leading=13,
            spaceAfter=2,
        ),
    }
    return styles


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 1.15 * cm, A4[0], 1.15 * cm, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(2 * cm, A4[1] - 0.75 * cm, "Desafio Tecnico PS 2026.2  |  manutencao  |  Backend")
    canvas.drawRightString(A4[0] - 2 * cm, A4[1] - 0.75 * cm, "Correcoes Laravel")
    canvas.setFillColor(SOFT)
    canvas.rect(0, 0, A4[0], 1.1 * cm, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(2 * cm, 0.45 * cm, "Documento interno de estudo  -  nao substitui o README da entrega")
    canvas.drawRightString(A4[0] - 2 * cm, 0.45 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def box_table(rows, col_widths, styles):
    data = []
    for i, row in enumerate(rows):
        if i == 0:
            data.append([Paragraph(cell, styles["th"]) for cell in row])
        else:
            data.append([Paragraph(cell, styles["td"]) for cell in row])
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("BACKGROUND", (0, 1), (-1, -1), SOFT),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.4, LINE),
            ]
        )
    )
    return table


def code_block(text):
    return Preformatted(text.strip("\n"), ParagraphStyle(
        "pre",
        fontName="Courier",
        fontSize=8,
        leading=11,
        textColor=CODE_FG,
        backColor=CODE_BG,
        leftIndent=8,
        rightIndent=8,
        spaceBefore=4,
        spaceAfter=10,
        borderPadding=8,
    ))


def bullets(items, styles):
    flow = []
    for item in items:
        flow.append(ListItem(Paragraph(item, styles["bullet"]), leftIndent=12, bulletColor=TEAL))
    return ListFlowable(flow, bulletType="bullet", start="circle", leftIndent=18, spaceAfter=8)


def build():
    styles = build_styles()
    story = []

    story.append(Spacer(1, 1.4 * cm))
    story.append(Paragraph("PS ADAPTI 2026.2  Â·  4Âª ETAPA", styles["cover_kicker"]))
    story.append(Paragraph("O que foi corrigido no backend (MissÃ£o 1)", styles["cover_title"]))
    story.append(Paragraph(
        "Este PDF explica, em linguagem de estudo, <b>cada problema encontrado no Laravel</b>, "
        "por que ele quebrava o sistema e o que foi alterado no cÃ³digo. "
        "Nada de frontend, nada de Tarefas ainda: sÃ³ a manutenÃ§Ã£o da API de Projetos e Membros.",
        styles["cover_sub"],
    ))
    story.append(Paragraph(
        "Escopo: correÃ§Ã£o de bugs do desafio. NÃ£o inclui modelagem de Tarefas nem a trava de 2 projetos ativos.",
        styles["note"],
    ))

    story.append(Paragraph("1. Por que o backend precisava de correÃ§Ã£o", styles["h1"]))
    story.append(Paragraph(
        "O edital pede para investigar falhas sutis. No cÃ³digo base, Projetos e Membros jÃ¡ tinham "
        "controller, model, factory e Form Request â€” mas vÃ¡rias peÃ§as estavam <b>incompletas ou invertidas</b>. "
        "O resultado prÃ¡tico: a API aceitava dados invÃ¡lidos, recusava atualizaÃ§Ãµes que deveriam funcionar "
        "e, no cadastro de membros, podia gravar registro inconsistente (ou nem gravar, por causa do SQL).",
        styles["body"],
    ))
    story.append(Paragraph(
        "Pense no Form Request como o â€œporteiroâ€ da API: ele decide se a requisiÃ§Ã£o entra e com quais regras. "
        "O Model Ã© quem de fato escreve no banco (mass assignment via <font face='Courier'>$fillable</font>). "
        "Se o porteiro estÃ¡ de folga ou o model ignora um campo, o banco recebe lixo â€” ou recebe 403.",
        styles["body"],
    ))

    story.append(Paragraph("2. Mapa rÃ¡pido: problema â†’ arquivo â†’ efeito", styles["h1"]))
    story.append(box_table(
        [
            ["Problema", "Onde estava", "Efeito na API"],
            [
                "Data de tÃ©rmino anterior Ã  de inÃ­cio",
                "StoreProjetoRequest",
                "POST /projetos gravava perÃ­odo invertido (200/201)",
            ],
            [
                "Update de projeto bloqueado e sem regras",
                "UpdateProjetoRequest",
                "PUT/PATCH /projetos/{id} sempre 403",
            ],
            [
                "Create/update de membro bloqueados",
                "StoreMembroRequest e UpdateMembroRequest",
                "POST/PUT /membros sempre 403",
            ],
            [
                "Senha validada mas nunca salva",
                "Membro::$fillable",
                "Mass assignment descartava senha; NOT NULL podia falhar",
            ],
            [
                "Senha em texto puro se passasse",
                "Model Membro sem cast hashed",
                "Risco de gravar senha sem hash",
            ],
            [
                "E-mail duplicado e formato livre",
                "Requests + migration sem unique",
                "Dois membros com o mesmo e-mail",
            ],
            [
                "Campos NULL vs colunas NOT NULL",
                "Requests nullable vs tabela",
                "SQLSTATE 23000 ao omitir cor/aniversÃ¡rio",
            ],
            [
                "Factory de projeto mutava a data",
                "ProjetoFactory",
                "Seeds com data_inicio errada / fim antes do inÃ­cio",
            ],
            [
                "Factory hasheava senha duas vezes (depois do cast)",
                "MembroFactory",
                "Hash duplo se o model passar a usar cast hashed",
            ],
            [
                "PATCH sÃ³ com data_fim ignorava inÃ­cio salvo",
                "UpdateProjetoRequest",
                "Podia gravar fim anterior ao inÃ­cio existente",
            ],
            [
                "Projetos com Route::resource",
                "routes/api.php",
                "Rotas HTML create/edit sem aÃ§Ã£o na API",
            ],
        ],
        [5.2 * cm, 5.3 * cm, 6.5 * cm],
        styles,
    ))

    story.append(Paragraph("3. Projetos: validaÃ§Ã£o de datas", styles["h1"]))
    story.append(Paragraph("3.1 O que o desafio pedia", styles["h2"]))
    story.append(Paragraph(
        "O endpoint de criaÃ§Ã£o de Projetos estava permitindo data de tÃ©rmino anterior Ã  data de inÃ­cio. "
        "A correÃ§Ã£o tem de recusar isso e devolver erro <b>legÃ­vel</b> (HTTP 422, mensagem em portuguÃªs).",
        styles["body"],
    ))
    story.append(Paragraph("3.2 Como estava", styles["h2"]))
    story.append(Paragraph(
        "Em <font face='Courier'>app/Http/Requests/StoreProjetoRequest.php</font> as datas sÃ³ exigiam existir e ser â€œdateâ€. "
        "NÃ£o havia comparaÃ§Ã£o entre elas. O Laravel aceitava, por exemplo, inÃ­cio 2026-12-01 e fim 2026-01-01.",
        styles["body"],
    ))
    story.append(code_block("""
'data_inicio' => 'required|date',
'data_fim'    => 'required|date',   // aceitava qualquer data, inclusive anterior
"""))
    story.append(Paragraph("3.3 O que foi feito", styles["h2"]))
    story.append(Paragraph(
        "Foi adicionada a regra <font face='Courier'>after_or_equal:data_inicio</font> em <b>criar e atualizar</b>. "
        "TambÃ©m foram reforÃ§ados tipos (<font face='Courier'>string</font>, <font face='Courier'>max:255</font>) "
        "e mensagens em portuguÃªs via <font face='Courier'>messages()</font> e <font face='Courier'>attributes()</font>.",
        styles["body"],
    ))
    story.append(code_block("""
'data_inicio' => ['required', 'date'],
'data_fim'    => ['required', 'date', 'after_or_equal:data_inicio'],

// mensagem amigÃ¡vel
'data_fim.after_or_equal' =>
    'A data de tÃ©rmino deve ser igual ou posterior Ã  data de inÃ­cio.',
"""))
    story.append(Paragraph(
        "Resposta esperada da API quando a regra quebra: status <b>422 Unprocessable Entity</b>, "
        "JSON no padrÃ£o Laravel (<font face='Courier'>message</font> + <font face='Courier'>errors.data_fim</font>). "
        "O frontend depois sÃ³ precisa exibir essa string â€” por isso a mensagem precisa ser clara.",
        styles["body"],
    ))

    story.append(Paragraph("3.4 Update de projeto estava morto", styles["h2"]))
    story.append(Paragraph(
        "<font face='Courier'>UpdateProjetoRequest::authorize()</font> retornava <b>false</b> e "
        "<font face='Courier'>rules()</font> estava vazio. No Laravel, authorize false = <b>403 Forbidden</b> "
        "antes mesmo de validar. Ou seja: ninguÃ©m conseguia editar projeto pela API, e se liberasse o authorize "
        "ainda assim nÃ£o haveria regra de datas no PUT.",
        styles["body"],
    ))
    story.append(Paragraph(
        "CorreÃ§Ã£o: <font face='Courier'>authorize(): true</font> (o desafio deixa Projetos/Membros pÃºblicos, "
        "como jÃ¡ estava no store) e as mesmas regras do store, com <font face='Courier'>sometimes</font> "
        "para permitir PATCH parcial. A trava de datas vale tambÃ©m na atualizaÃ§Ã£o.",
        styles["body"],
    ))
    story.append(Paragraph(
        "HÃ¡ um detalhe extra no update: a regra <font face='Courier'>after_or_equal:data_inicio</font> sÃ³ compara "
        "campos que vieram no mesmo payload. Se alguÃ©m mandar sÃ³ <font face='Courier'>data_fim</font> (PATCH), "
        "o Laravel nÃ£o olha a <font face='Courier'>data_inicio</font> jÃ¡ gravada no banco. "
        "Por isso o update usa <font face='Courier'>withValidator()</font>: depois das regras simples, "
        "ele junta o que veio na request com o que jÃ¡ existe no projeto e sÃ³ entÃ£o compara inÃ­cio e fim.",
        styles["body"],
    ))
    story.append(code_block("""
public function withValidator(Validator $validator): void
{
    $validator->after(function (Validator $validator): void {
        $projeto = Projeto::query()->find($this->route('projeto'));
        $inicio = $this->input('data_inicio', $projeto?->data_inicio?->format('Y-m-d'));
        $fim    = $this->input('data_fim',    $projeto?->data_fim?->format('Y-m-d'));

        if ($inicio && $fim && $fim < $inicio) {
            $validator->errors()->add(
                'data_fim',
                'A data de tÃ©rmino deve ser igual ou posterior Ã  data de inÃ­cio.'
            );
        }
    });
}
"""))

    story.append(Paragraph("3.5 Model Projeto", styles["h2"]))
    story.append(Paragraph(
        "Em <font face='Courier'>app/Models/Projeto.php</font> foram adicionados casts de data. "
        "Isso nÃ£o Ã© o bug do edital, mas evita serializar as colunas como string solta e deixa o Eloquent "
        "tratar <font face='Courier'>data_inicio</font> e <font face='Courier'>data_fim</font> como Carbon.",
        styles["body"],
    ))
    story.append(code_block("""
protected function casts(): array
{
    return [
        'data_inicio' => 'date',
        'data_fim'    => 'date',
    ];
}
"""))

    story.append(Paragraph("4. Membros: inconsistÃªncias de banco e de request", styles["h1"]))
    story.append(Paragraph(
        "O edital fala em â€œinconsistÃªncias no bancoâ€ no cadastro de Membros. NÃ£o era um Ãºnico bug: "
        "eram vÃ¡rios desalinhamentos entre Form Request, Model e migration.",
        styles["body"],
    ))

    story.append(Paragraph("4.1 authorize() false â€” cadastro e ediÃ§Ã£o 403", styles["h2"]))
    story.append(Paragraph(
        "Store e Update de Membro tambÃ©m tinham <font face='Courier'>authorize(): false</font>. "
        "Na prÃ¡tica a tela de â€œNovo membroâ€ nunca chegaria a gravar: a API respondia 403. "
        "Foi alterado para <font face='Courier'>true</font>, no mesmo espÃ­rito das rotas pÃºblicas jÃ¡ existentes "
        "em <font face='Courier'>routes/api.php</font> (<font face='Courier'>apiResource('/membros')</font> sem Sanctum).",
        styles["body"],
    ))

    story.append(Paragraph("4.2 Senha nÃ£o ia para o banco (mass assignment)", styles["h2"]))
    story.append(Paragraph(
        "A tabela <font face='Courier'>membros</font> tem coluna <font face='Courier'>senha</font> NOT NULL. "
        "O Form Request validava a senha. O controller fazia <font face='Courier'>$this->membro->create($validatedData)</font>. "
        "PorÃ©m, no model, <font face='Courier'>senha</font> <b>nÃ£o estava em $fillable</b>.",
        styles["body"],
    ))
    story.append(Paragraph(
        "O Eloquent, por seguranÃ§a, ignora campos que nÃ£o estÃ£o em fillable. Resultado: a senha validada era jogada fora. "
        "Ou o INSERT falhava (coluna NOT NULL sem valor), ou o registro nascia sem senha Ãºtil. "
        "Isso Ã© exatamente o tipo de inconsistÃªncia que o desafio pedia para achar.",
        styles["body"],
    ))
    story.append(Paragraph(
        "CorreÃ§Ã£o: incluir <font face='Courier'>senha</font> em <font face='Courier'>$fillable</font>. "
        "Ela continua em <font face='Courier'>$hidden</font>, entÃ£o o JSON da API <b>nÃ£o devolve</b> a senha.",
        styles["body"],
    ))

    story.append(Paragraph("4.3 Hash da senha (cast hashed)", styles["h2"]))
    story.append(Paragraph(
        "Mesmo fillable, o controller gravaria a senha em texto puro. O model User do prÃ³prio template jÃ¡ usa "
        "o cast <font face='Courier'>'password' => 'hashed'</font>. Foi feito o equivalente para Membro:",
        styles["body"],
    ))
    story.append(code_block("""
protected function casts(): array
{
    return [
        'senha' => 'hashed',
        'data_aniversario' => 'date',
    ];
}
"""))
    story.append(Paragraph(
        "O cast <font face='Courier'>hashed</font> chama o hasher do Laravel na hora do set. "
        "Por isso a factory agora envia senha em texto simples (<font face='Courier'>Password1!</font>), "
        "nÃ£o um bcrypt pronto: se a factory jÃ¡ hasheasse e o model hasheasse de novo, ninguÃ©m autenticaria depois.",
        styles["body"],
    ))

    story.append(Paragraph("4.4 E-mail: formato + unicidade", styles["h2"]))
    story.append(Paragraph(
        "A regra antiga era sÃ³ <font face='Courier'>required|string|max:255</font>. Dava para salvar "
        "<font face='Courier'>nao-e-email</font> e repetir o mesmo endereÃ§o em vÃ¡rios membros. "
        "No banco, a coluna email tambÃ©m nÃ£o era unique.",
        styles["body"],
    ))
    story.append(Paragraph("Agora:", styles["body"]))
    story.append(bullets([
        "ValidaÃ§Ã£o <font face='Courier'>email</font> (formato).",
        "ValidaÃ§Ã£o <font face='Courier'>unique:membros,email</font> no store.",
        "No update: <font face='Courier'>Rule::unique(...)->ignore($this->route('membro'))</font> â€” o prÃ³prio membro pode manter o e-mail; outro nÃ£o pode copiar.",
        "Migration da tabela: <font face='Courier'>$table->string('email')->unique()</font>.",
        "Mensagem: â€œJÃ¡ existe um membro cadastrado com este e-mail.â€",
    ], styles))
    story.append(Paragraph(
        "O parÃ¢metro da rota no <font face='Courier'>apiResource</font> se chama <font face='Courier'>membro</font> "
        "(nÃ£o id). O ignore usa <font face='Courier'>$this->route('membro')</font> para nÃ£o dar falso positivo de unique no prÃ³prio registro.",
        styles["note"],
    ))

    story.append(Paragraph("4.5 cor_favorita e data_aniversario: NULL vs NOT NULL", styles["h2"]))
    story.append(Paragraph(
        "As requests marcavam esses campos como <font face='Courier'>nullable</font> (e o formulÃ¡rio do frontend trata como opcional). "
        "A migration original os criava <b>NOT NULL</b>. Um POST vÃ¡lido sem esses campos gerava erro SQL, "
        "nÃ£o um 422 bonitinho. Isso Ã© inconsistÃªncia clÃ¡ssica: validaÃ§Ã£o e schema nÃ£o combinavam.",
        styles["body"],
    ))
    story.append(Paragraph(
        "DecisÃ£o: deixar as colunas <b>nullable no banco</b>, alinhadas com o request e com a UI. "
        "Assim omitir cor ou aniversÃ¡rio Ã© permitido; e-mail, nome e senha continuam obrigatÃ³rios no create.",
        styles["body"],
    ))

    story.append(Paragraph("5. Factories (seed / testes)", styles["h1"]))
    story.append(Paragraph("5.1 ProjetoFactory â€” DateTime mutÃ¡vel", styles["h2"]))
    story.append(Paragraph(
        "O cÃ³digo antigo fazia <font face='Courier'>$dataInicio->modify('+1 day')</font> <b>dentro</b> do "
        "<font face='Courier'>dateTimeBetween</font>. Em PHP, <font face='Courier'>DateTime::modify</font> "
        "altera o prÃ³prio objeto e devolve ele. Depois, ao gravar <font face='Courier'>data_inicio</font>, "
        "jÃ¡ era o dia seguinte. Seeds podiam nascer com intervalo estranho.",
        styles["body"],
    ))
    story.append(code_block("""
$dataInicio = fake()->dateTimeBetween('2025-01-01', '2027-12-29');
$dataFim = fake()->dateTimeBetween(
    (clone $dataInicio)->modify('+1 day'),  // clone evita mutar o inÃ­cio
    '2027-12-31'
);
"""))
    story.append(Paragraph("5.2 MembroFactory â€” senha e unique", styles["h2"]))
    story.append(Paragraph(
        "A factory jÃ¡ gerava e-mail unique (Faker). A senha passou a ser texto plano compatÃ­vel com o cast hashed. "
        "Valor usado: <font face='Courier'>Password1!</font> â€” atende letras, maiÃºscula, nÃºmero e sÃ­mbolo da Password Rule, "
        "caso alguÃ©m reutilize a factory em testes de validaÃ§Ã£o.",
        styles["body"],
    ))

    story.append(Paragraph("6. Rotas de projetos: resource vs apiResource", styles["h1"]))
    story.append(Paragraph(
        "Em <font face='Courier'>routes/api.php</font>, membros jÃ¡ usavam <font face='Courier'>apiResource</font>, "
        "mas projetos usavam <font face='Courier'>Route::resource</font>. Resource â€œcompletoâ€ registra tambÃ©m "
        "<font face='Courier'>GET /projetos/create</font> e <font face='Courier'>GET /projetos/{id}/edit</font>, "
        "rotas pensadas para HTML (formulÃ¡rios Blade). Neste projeto a API sÃ³ tem JSON no controller â€” "
        "essas duas rotas extra nÃ£o tÃªm aÃ§Ã£o Ãºtil e poluem o <font face='Courier'>route:list</font>.",
        styles["body"],
    ))
    story.append(Paragraph(
        "CorreÃ§Ã£o: os dois recursos agora sÃ£o <font face='Courier'>apiResource</font> (index, store, show, update, destroy). "
        "NÃ£o muda o contrato que o Next jÃ¡ usa; sÃ³ alinha Projetos com Membros.",
        styles["body"],
    ))
    story.append(code_block("""
Route::apiResource('/membros', MembroController::class);
Route::apiResource('/projetos', ProjetoController::class);
"""))

    story.append(Paragraph("7. Controller de Membro", styles["h1"]))
    story.append(Paragraph(
        "A lÃ³gica de upload de imagem em <font face='Courier'>MembroController</font> foi mantida. "
        "SÃ³ foi removido o <font face='Courier'>use Throwable</font> que nÃ£o era usado (limpeza). "
        "NÃ£o foi preciso hashear no controller: o model cuida disso. "
        "Fluxo atual do store: validar â†’ opcionalmente salvar arquivo em disk public â†’ create (senha hasheada automaticamente).",
        styles["body"],
    ))

    story.append(Paragraph("8. Arquivos alterados (lista fechada)", styles["h1"]))
    story.append(box_table(
        [
            ["Arquivo", "Tipo de mudanÃ§a"],
            ["backend/app/Http/Requests/StoreProjetoRequest.php", "Regras de data, tipos, mensagens PT"],
            ["backend/app/Http/Requests/UpdateProjetoRequest.php", "authorize true, sometimes, withValidator nas datas"],
            ["backend/app/Http/Requests/StoreMembroRequest.php", "authorize true, email Ãºnico, mensagens"],
            ["backend/app/Http/Requests/UpdateMembroRequest.php", "authorize true, unique ignore, nullable alinhado"],
            ["backend/app/Models/Membro.php", "fillable senha + casts hashed e date"],
            ["backend/app/Models/Projeto.php", "casts de data_inicio e data_fim"],
            ["backend/database/migrations/2026_10_06_234716_create_membros_table.php", "email unique; cor e aniversÃ¡rio nullable"],
            ["backend/database/factories/MembroFactory.php", "senha em texto; hash fica no model"],
            ["backend/database/factories/ProjetoFactory.php", "clone da data para nÃ£o mutar inÃ­cio"],
            ["backend/app/Http/Controllers/MembroController.php", "remoÃ§Ã£o de import morto"],
            ["backend/routes/api.php", "projetos: Route::resource â†’ apiResource (sÃ³ rotas de API)"],
        ],
        [11.2 * cm, 5.8 * cm],
        styles,
    ))
    story.append(Paragraph(
        "NÃ£o foram criadas tabelas de Tarefas nem pivot membro-projeto neste momento. "
        "Isso Ã© MissÃ£o 2 e ficou de propÃ³sito para o prÃ³ximo passo.",
        styles["note"],
    ))

    story.append(Paragraph("9. Como validar na prÃ¡tica", styles["h1"]))
    story.append(Paragraph(
        "Se o banco jÃ¡ tinha sido migrado com a tabela antiga, rode na pasta backend:",
        styles["body"],
    ))
    story.append(code_block("""
php artisan migrate:fresh --seed
php artisan serve
"""))
    story.append(Paragraph(
        "<b>migrate:fresh</b> apaga as tabelas e recria. Use sÃ³ em ambiente local. "
        "Ã‰ o caminho mais simples porque a unique/nullable estÃ¡ na migration de create, "
        "nÃ£o numa migration de ALTER (o Laravel 11.4 deste template precisaria de doctrine/dbal para change()).",
        styles["body"],
    ))
    story.append(Paragraph("9.1 Casos para testar (Postman, Insomnia ou Thunder Client)", styles["h2"]))
    story.append(box_table(
        [
            ["Chamada", "Body / condiÃ§Ã£o", "Esperado"],
            [
                "POST /projetos",
                "data_fim anterior a data_inicio",
                "422 + mensagem da data de tÃ©rmino",
            ],
            [
                "POST /projetos",
                "datas iguais ou fim depois do inÃ­cio",
                "201 Created",
            ],
            [
                "PUT /projetos/{id}",
                "payload vÃ¡lido",
                "200 (antes era 403)",
            ],
            [
                "PATCH /projetos/{id}",
                "sÃ³ data_fim anterior Ã  data_inicio jÃ¡ salva",
                "422 (withValidator olha o banco)",
            ],
            [
                "POST /membros",
                "payload vÃ¡lido com senha forte",
                "201; JSON sem campo senha",
            ],
            [
                "POST /membros",
                "mesmo e-mail de outro membro",
                "422 unique",
            ],
            [
                "POST /membros",
                "e-mail invÃ¡lido ou senha fraca",
                "422 com errors no campo",
            ],
            [
                "POST /membros",
                "sem cor_favorita / data_aniversario",
                "201 (colunas nullable)",
            ],
            [
                "PUT /membros/{id}",
                "payload vÃ¡lido",
                "200 (antes era 403)",
            ],
        ],
        [4.2 * cm, 6.5 * cm, 6.3 * cm],
        styles,
    ))
    story.append(Paragraph(
        "Senha forte do Laravel Password Rule neste projeto: mÃ­nimo 8 caracteres, letra, maiÃºscula e minÃºscula, nÃºmero e sÃ­mbolo. "
        "Exemplo vÃ¡lido: <font face='Courier'>Password1!</font>",
        styles["note"],
    ))

    story.append(Paragraph("10. Como explicar na apresentaÃ§Ã£o (roteiro curto)", styles["h1"]))
    story.append(bullets([
        "â€œA API de projetos aceitava perÃ­odo invertido; a regra after_or_equal fecha isso no porteiro (Form Request), nÃ£o no controller.â€",
        "â€œUpdate estava com authorize false â€” 403 silencioso. Liberamos e copiamos as regras, senÃ£o o bug das datas voltava no PUT.â€",
        "â€œNo PATCH, withValidator compara com as datas jÃ¡ salvas, porque after_or_equal sÃ³ vÃª o payload.â€",
        "â€œMembro: senha existia na tabela e na validaÃ§Ã£o, mas fillable a descartava. Isso Ã© mass assignment, nÃ£o â€œo banco bugou sozinhoâ€.â€",
        "â€œCast hashed igual ao User do template; hidden continua escondendo senha no JSON.â€",
        "â€œUnique no e-mail em dois lugares: validaÃ§Ã£o (mensagem amigÃ¡vel) e Ã­ndice no banco (Ãºltima trava).â€",
        "â€œSchema e request agora combinam: campos opcionais sÃ£o nullable de verdade.â€",
    ], styles))

    story.append(Paragraph("11. O que propositalmente NÃƒO foi feito agora", styles["h1"]))
    story.append(bullets([
        "Telas Next.js, hidrataÃ§Ã£o, sidebar mobile, toasts â€” frontend, prÃ³ximo bloco.",
        "Entidade Tarefas, pivot N:N e trava de 2 projetos ativos â€” MissÃ£o 2.",
        "Swagger, autenticaÃ§Ã£o Sanctum nas rotas de membros/projetos â€” o template original deixou essas rotas pÃºblicas; nÃ£o mudei o contrato sem necessidade.",
        "README final da entrega e prints â€” MissÃ£o 3.",
    ], styles))
    story.append(Paragraph(
        "Quando for implementar a MissÃ£o 2, a trava de alocaÃ§Ã£o deve viver no backend (422 claro) e o frontend sÃ³ exibe a mensagem. "
        "A base de Projetos/Membros que acabamos de consertar Ã© o alicerce dessa regra.",
        styles["body"],
    ))

    story.append(Paragraph("12. Recado de estudo", styles["h1"]))
    story.append(Paragraph(
        "Se um avaliador perguntar â€œpor que nÃ£o validar data no controller?â€, a resposta boa Ã©: "
        "controller orquestra; Form Request valida entrada; Model protege persistÃªncia (fillable, casts, unique). "
        "Cada camada com uma responsabilidade. Foi isso que o cÃ³digo base misturava ou deixava pela metade.",
        styles["body"],
    ))
    story.append(Paragraph(
        "Guarde este PDF para estudar. Na entrega oficial, o que conta no GitHub Ã© o README + o PR â€” "
        "este arquivo Ã© o seu material de revisÃ£o, passo a passo, do que o backend ganhou nesta primeira leva.",
        styles["body"],
    ))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.6 * cm,
        title="Correcoes Backend - manutencao",
        author="Thilon",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
