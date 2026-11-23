/* GUIA — mini guia de uso para cada fonte do hub.
   Cada link de ferramenta ganha um botão "Como usar". O guia é montado na hora a partir de:
   tipo da fonte (detectado pela URL, título, descrição e seção) + dica específica do serviço, quando houver
   + etiquetas da revisão (fora do ar, pago, cadastro, toca o alvo). */
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'').toLowerCase()}catch(e){return ''}};
const REG='Registre URL, data e hora, print da tela inteira e o que você digitou. Se o resultado importar, salve o arquivo e calcule o hash (<a href="#m01-preservacao">preservação</a>).';
const K={
 onion:{n:'Endereço na rede Tor (.onion)',para:'Página que só abre pela rede Tor. Objeto de estudo: observar, não interagir.',
  passos:['Abra só dentro da VM de investigação (Whonix ou Tails), nunca no computador pessoal.','Use o Tor Browser no nível de segurança “Mais seguro” (JavaScript desligado).','Confira o endereço completo: sites falsos copiam o começo do .onion.','Leia e registre; não faça login, não compre, não baixe arquivos, não converse.'],
  io:'endereço .onion → conteúdo da página',cuidado:'Endereços mudam e muitos são golpes ou réplicas. Não clique em arquivos. Conteúdo ilícito: pare e siga o protocolo da sua instituição.',ver:['m07-b-ambiente','m11-a-zonas']},
 cli:{n:'Ferramenta para instalar (terminal / código)',para:'Programa que roda na sua máquina, geralmente pelo terminal.',
  passos:['Leia o README: o que faz, requisitos, exemplo de uso.','Veja se está viva: data do último commit, issues abertas, estrelas.','Instale numa VM, num ambiente separado: <code>git clone URL</code> → <code>cd pasta</code> → <code>python3 -m venv .venv</code> → <code>. .venv/bin/activate</code> → <code>pip install -r requirements.txt</code> (ou o comando do README).','Rode primeiro com <code>--help</code> e depois com um dado seu, de teste.','Salve a saída em arquivo (<code>&gt; resultado.txt</code>) com data no nome.'],
  io:'dado (username, e-mail, domínio…) → relatório no terminal ou arquivo',cuidado:'Código de terceiros roda com as suas permissões: nunca no computador pessoal. Muitas consultam o alvo diretamente — veja o que a ferramenta toca.',ver:['m01-vm','m02-avi-ambiente']},
 ext:{n:'Extensão de navegador',para:'Complemento que acrescenta botões ou coleta dados da página aberta.',
  passos:['Instale só no perfil de navegador do AVI, nunca no pessoal.','Antes de instalar, leia as permissões pedidas (“ler e alterar dados de todos os sites” é muito).','Fixe o ícone na barra; abra a página-alvo e acione a extensão.','Revise depois: extensões trocam de dono e mudam de comportamento.'],
  io:'página aberta → dados extraídos, captura ou link',cuidado:'Extensões veem tudo o que você navega. Remova as que não usa.',ver:['m02-avi-ambiente','m01-navegacao']},
 gov:{n:'Fonte oficial (governo, tribunal, cartório)',para:'Dado público de fonte primária, com valor de documento.',
  passos:['Identifique o formulário certo (CPF, CNPJ, nome, número do processo, placa).','Preencha um campo por vez; muitos sistemas exigem dado exato, com ou sem pontuação.','Baixe a certidão, o PDF ou o JSON quando houver; prefira ao print.','Se o dado não estiver aberto, avalie pedido pela Lei de Acesso à Informação.'],
  io:'identificador → registro oficial',cuidado:'Consulta oficial é fonte primária: cite órgão, data e número do documento. Dados pessoais seguem a LGPD.',ver:['m06-e-lai','m06-e-portal']},
 news:{n:'Notícia, artigo ou blog',para:'Relato publicado sobre um caso, técnica ou ferramenta.',
  passos:['Leia data, autor e veículo antes do texto.','Separe fato de opinião; anote os dados verificáveis (nomes, datas, números, links).','Confirme o essencial em uma segunda fonte independente.','Arquive a página (archive.today ou Wayback) antes de citar.'],
  io:'leitura → fatos, nomes e pistas para pivotar',cuidado:'Matéria pode ser corrigida ou apagada. Cite a versão arquivada.',ver:['m01-validade','m05-a-deepfake']},
 paper:{n:'Leitura acadêmica (paper, livro, relatório)',para:'Texto técnico ou científico que fundamenta o método.',
  passos:['No Google Scholar, procure a versão revisada por pares (não só o preprint) e o “Citado por”.','Leia na ordem: resumo → conclusão → método → limitações.','Anote em 3 linhas: pergunta, método, resultado — e uma crítica.','Guarde a referência completa (autores, ano, veículo, DOI).'],
  io:'título → versão oficial, citações e método',cuidado:'Cheque editora e indexação: periódico predatório e título truncado são armadilhas comuns.',ver:['m11-a-lista']},
 data:{n:'Dataset (base de dados)',para:'Conjunto de dados para treinar, medir ou testar um método.',
  passos:['Leia a licença e os termos de uso antes de baixar.','Veja o dicionário de dados: o que é cada coluna, período, origem.','Comece pequeno: uma amostra no Python (pandas ou csv da stdlib).','Registre a versão e o hash do arquivo baixado.'],
  io:'download → tabela ou grafo para análise',cuidado:'Dataset com dado pessoal é tratamento de dado (LGPD). Não republique.',ver:['m11-b-t6']},
 video:{n:'Vídeo, documentário ou palestra',para:'Conteúdo para estudar um caso ou técnica.',
  passos:['Anote o título, o canal ou serviço e a data.','Assista com caderno aberto: técnicas, ferramentas e nomes citados.','Pause para testar cada ferramenta citada no seu ambiente.'],
  io:'assistir → técnicas e casos',cuidado:'Documentário dramatiza. Confirme os fatos em fontes escritas.',ver:['m01-cases']},
 col:{n:'Coleção de ferramentas (indexadora)',para:'Página que reúne links por tema; o ponto de partida, não o fim.',
  passos:['Navegue pela categoria do seu dado (e-mail, username, imagem…).','Teste três ferramentas da categoria com um dado seu.','Favorite as que funcionaram (★ neste hub) e anote as fora do ar.','Volte de tempos em tempos: coleções envelhecem rápido.'],
  io:'tema → lista de ferramentas',cuidado:'Muitos links quebram. Prefira coleções com data de revisão.',ver:['m08-a-indexadoras','m09-c-osf']},
 search:{n:'Buscador',para:'Motor de busca geral. Cada um indexa partes diferentes da web.',
  passos:['Comece com aspas para frase exata: <code>"nome completo"</code>.','Some operadores: <code>site:</code>, <code>filetype:</code>, <code>intitle:</code>, <code>-palavra</code>.','Repita a mesma busca em pelo menos dois buscadores diferentes.','Use a aba de ferramentas para filtrar por data.'],
  io:'termo + operadores → páginas indexadas',cuidado:'Resultados variam por país, idioma e login. Busque deslogado, no navegador do AVI.',ver:['m02-b-motores','m02-b-operadores','m02-lab-dork']},
 dork:{n:'Dorks e consultas prontas',para:'Consultas com operadores avançados, prontas ou geradas.',
  passos:['Escolha a dork da categoria (arquivos, painéis, documentos).','Troque o alvo (domínio, nome) pelo seu.','Rode no buscador e refine com <code>-</code> para tirar ruído.'],
  io:'modelo de consulta → resultados filtrados',cuidado:'Dork que acha senha ou painel exposto: observe, não acesse. Acessar sistema sem autorização é crime.',ver:['m02-b-operadores','m02-lab-dork']},
 user:{n:'Busca por username',para:'Verifica em quais sites o mesmo nome de usuário existe.',
  passos:['Digite o username exato, sem @.','Abra cada resultado positivo e confira foto, bio e datas.','Marque como “provável” até ligar a conta por outro dado (e-mail, foto, ID).','Teste variações: com ponto, underline, números.'],
  io:'username → lista de perfis possíveis',cuidado:'Falso positivo é comum: username igual não é pessoa igual.',ver:['m04-a-username','m09-c-username','m04-lab-user']},
 email:{n:'Investigação de e-mail',para:'Descobre contas, vazamentos e dados ligados a um endereço de e-mail.',
  passos:['Valide o formato e o domínio do e-mail.','Rode a consulta e anote em quais serviços o e-mail aparece.','Pivote: nome, foto, username ou telefone que surgirem.','Cruze com a busca em vazamentos.'],
  io:'e-mail → contas, nome, foto, vazamentos',cuidado:'Algumas ferramentas acionam “esqueci a senha” e podem alertar o dono. Leia como a ferramenta consulta.',ver:['m03-b-mapa','m09-c-email']},
 leak:{n:'Vazamentos e credenciais expostas',para:'Mostra se um dado aparece em bases vazadas.',
  passos:['Consulte o e-mail, domínio ou username.','Anote o nome do vazamento, a data e os tipos de dado expostos.','Use a informação como pista para pivotar, não como prova.'],
  io:'e-mail/domínio → vazamentos em que aparece',cuidado:'Baixar ou guardar base vazada tem implicação legal (LGPD). Consulte, não baixe.',ver:['m03-b-vaz','m10-lab-livro']},
 phone:{n:'Telefone',para:'Identifica operadora, região, tipo de linha ou contas ligadas a um número.',
  passos:['Coloque o número no formato internacional: <code>+55 DDD número</code>.','Rode a consulta e anote operadora, tipo e localidade.','Pivote para WhatsApp, Telegram e redes que mostram contas pelo número.'],
  io:'número → operadora, região, contas',cuidado:'Portabilidade muda a operadora. Apps de “quem ligou” mostram nomes salvos por terceiros, não identidade confirmada.',ver:['m05-c-numero','m09-c-telefone']},
 domain:{n:'Domínio, WHOIS e DNS',para:'Mostra quem registrou um domínio, onde está hospedado e o histórico.',
  passos:['Digite só o domínio (sem https:// e sem caminho).','Leia titular, datas de criação e vencimento, servidores DNS.','Se o WHOIS estiver oculto, procure o histórico de WHOIS e os certificados.','Pivote: e-mail do registrante, IP, outros domínios no mesmo servidor.'],
  io:'domínio → titular, datas, DNS, IP',cuidado:'WHOIS com privacidade é normal. Para .br, o Registro.br é a fonte primária.',ver:['m03-a-whois','m09-c-dominio','m03-lab-ids']},
 ip:{n:'IP e infraestrutura',para:'Localiza, classifica e mostra serviços expostos de um endereço IP.',
  passos:['Digite o IP (ou o domínio, se aceitar).','Leia provedor (ASN), país e cidade aproximada.','Veja portas e serviços expostos, quando a ferramenta mostrar.','Cheque se é CDN (Cloudflare), VPN ou saída do Tor antes de concluir.'],
  io:'IP → provedor, localização aproximada, serviços',cuidado:'Geolocalização de IP é aproximada. Ver um serviço exposto não autoriza acessá-lo.',ver:['m03-a-geo','m07-b-tor']},
 archive:{n:'Arquivo e cache da web',para:'Mostra versões antigas de páginas e guarda cópia de uma página agora.',
  passos:['Cole a URL completa.','Navegue pelo calendário de capturas e compare as versões.','Para preservar agora, use “Save page now” ou equivalente e anote o link da captura.'],
  io:'URL → capturas antigas ou cópia nova',cuidado:'Arquivar avisa o site? Em geral não, mas o pedido sai do serviço de arquivo, não de você.',ver:['m01-preservacao']},
 rimg:{n:'Busca reversa de imagem',para:'Acha onde a mesma imagem (ou parecida) já apareceu.',
  passos:['Envie o arquivo ou cole a URL da imagem.','Recorte só o trecho importante (rosto, placa, fachada) e busque de novo.','Repita em mais de um buscador (Google Lens, Yandex, Bing, TinEye).','Ordene pela data mais antiga para achar a origem.'],
  io:'imagem → páginas com a mesma imagem ou parecida',cuidado:'Enviar imagem de terceiro a um serviço é tratamento de dado. Reconhecimento facial tem limites legais e éticos.',ver:['m05-a-reversa','m09-c-local']},
 meta:{n:'Metadados e análise de imagem',para:'Lê EXIF (data, câmera, GPS) e procura sinais de edição.',
  passos:['Use o arquivo original, não print nem foto reenviada por app (apps apagam EXIF).','Leia data, aparelho, software e GPS.','Para edição, compare a análise de erro de nível (ELA) em várias áreas.','Anote o hash do arquivo analisado.'],
  io:'arquivo → metadados e indícios de edição',cuidado:'Metadado pode ser editado. Resultado orienta; conclusão em processo é com perícia.',ver:['m05-a-exif','m05-lab-exif']},
 vid:{n:'Vídeo: análise e download',para:'Extrai dados, quadros ou cópia de vídeos publicados.',
  passos:['Cole a URL do vídeo.','Anote canal, ID do vídeo, data de publicação e descrição.','Extraia quadros-chave e faça busca reversa deles.','Baixe para preservar e calcule o hash.'],
  io:'URL do vídeo → metadados, quadros, arquivo',cuidado:'Baixar para preservar prova é diferente de redistribuir. Respeite direitos autorais.',ver:['m05-b-youtube','m05-lab-video']},
 geo:{n:'Mapas e geolocalização',para:'Mapas, satélite e ruas para confirmar onde uma foto ou fato aconteceu.',
  passos:['Comece pelo que é único na imagem: placas, relevo, fachadas, sombra.','Busque o lugar e compare do alto (satélite) e do chão (rua).','Use imagens históricas para conferir a data.','Anote as coordenadas (lat, long) e o link de cada vista usada.'],
  io:'pistas visuais → coordenadas',cuidado:'Imagem de satélite tem data de captura; confira antes de concluir.',ver:['m05-d-mapas','m09-c-local']},
 transp:{n:'Veículos, voos e navios',para:'Rastreia aeronaves, embarcações ou dados de veículos.',
  passos:['Digite a matrícula, o número do voo, o IMO/MMSI ou a placa.','Veja a posição atual e o histórico disponível.','Registre com print e horário: dados ao vivo mudam a cada minuto.'],
  io:'identificador → posição, histórico, dados do veículo',cuidado:'Aeronaves podem pedir bloqueio de exibição. Placa leva a dado pessoal: use com base legal.',ver:['m06-d-veiculos','m06-lab-placa']},
 company:{n:'Empresas e CNPJ',para:'Dados cadastrais, sócios e vínculos de empresas.',
  passos:['Digite o CNPJ (com ou sem pontuação) ou o nome.','Anote situação, endereço, CNAE, capital e sócios.','Pivote pelos sócios para outras empresas e pelo endereço.'],
  io:'CNPJ/nome → cadastro e sócios',cuidado:'Agregadores copiam a Receita com atraso. Confirme na fonte oficial.',ver:['m06-c-cnpj','m06-lab-vinculos']},
 people:{n:'Pessoas e registros públicos',para:'Processos, diários oficiais, genealogia e outros registros sobre pessoas.',
  passos:['Busque o nome completo entre aspas e, se tiver, o CPF.','Filtre por estado, tribunal ou período.','Confirme homônimos por outro dado (data, cidade, filiação).'],
  io:'nome/CPF → registros públicos',cuidado:'Homônimo é o erro clássico. Dado pessoal segue a LGPD.',ver:['m06-b-pessoas','m09-c-nome']},
 chain:{n:'Blockchain e criptoativos',para:'Consulta endereços e transações em blockchains públicas.',
  passos:['Cole o endereço ou o hash da transação.','Anote saldo, primeira e última movimentação, entradas e saídas.','Siga as saídas uma a uma e marque as que parecem troco.','Procure etiquetas (exchange, serviço) nos explorers.'],
  io:'endereço/transação → saldo, histórico, contrapartes',cuidado:'Endereço não é pessoa. Monero e mixers quebram o rastreio.',ver:['m07-a-rastreamento','m07-lab-endereco']},
 social:{n:'Rede social',para:'Plataforma onde o alvo publica. Fonte central da SOCMINT.',
  passos:['Entre pelo AVI, nunca pela conta pessoal.','Anote o ID numérico da conta (não muda quando o nome muda).','Leia bio, links, fotos, seguidores e as primeiras publicações.','Preserve o que importar na hora: post some.'],
  io:'perfil → publicações, vínculos, ID',cuidado:'Seguir, curtir ou mandar mensagem pode alertar o alvo. Observe.',ver:['m04-a-id','m04-c-records']},
 socmint:{n:'Ferramenta de SOCMINT',para:'Serviço que extrai dados, métricas ou cópias de uma rede social.',
  passos:['Cole o username ou a URL do perfil/post.','Compare o resultado com o que a própria rede mostra.','Exporte ou faça print com data.'],
  io:'perfil/post → métricas, dados, cópia',cuidado:'Ferramentas de redes sociais quebram quando a rede muda a API. Teste antes de depender.',ver:['m04-a-username','m04-c-preserv']},
 opsec:{n:'Ambiente e OPSEC',para:'Ferramenta para proteger o investigador: VPN, Tor, VM, navegador.',
  passos:['Instale num ambiente separado do pessoal.','Teste se funciona: IP mudou? DNS vaza?','Documente a configuração usada em cada investigação.'],
  io:'configuração → navegação compartimentada',cuidado:'VPN não deixa ninguém anônimo sozinha. Login pessoal derruba qualquer proteção.',ver:['m01-anonimato','m02-avi-opsec']},
 graph:{n:'Análise de vínculos e organização',para:'Organiza entidades e relações num grafo ou caso.',
  passos:['Crie um caso por investigação.','Lance entidades (pessoa, e-mail, domínio) e as ligações com a fonte de cada uma.','Exporte o grafo para o relatório.'],
  io:'entidades → grafo de vínculos',cuidado:'Ligação no grafo é hipótese até ter fonte. Anote a origem de cada aresta.',ver:['m06-lab-vinculos','m01-modelos']},
 ai:{n:'Inteligência artificial',para:'Modelo de IA para resumir, traduzir, classificar ou gerar.',
  passos:['Não cole dado pessoal ou sigiloso do caso.','Peça a fonte de cada afirmação e confira.','Use como apoio: a conclusão é sua.'],
  io:'texto/imagem → resumo, tradução, classificação',cuidado:'IA inventa (alucina). Nada sai para o relatório sem checagem.',ver:['m02-b-ia']},
 trans:{n:'Tradução',para:'Traduz textos e páginas em outros idiomas.',
  passos:['Traduza o trecho e depois volte para o idioma original para conferir sentido.','Guarde o original junto da tradução.'],
  io:'texto → tradução',cuidado:'Gíria e contexto criminal se perdem. Em prova, use tradutor juramentado.',ver:['m02-b-motores']},
 law:{n:'Lei e norma',para:'Texto legal que define o que pode e o que não pode na investigação.',
  passos:['Leia o artigo citado e os parágrafos.','Confira se é o texto vigente (veja alterações).','Anote o número da lei e do artigo para citar.'],
  io:'norma → limite ou base legal',cuidado:'Mapa de estudo, não parecer jurídico.',ver:['biblia']},
 course:{n:'Curso, livro ou material de estudo',para:'Material para aprofundar o tema.',
  passos:['Veja autor, data e sumário antes de investir tempo.','Pratique cada capítulo no seu ambiente.'],
  io:'estudo → técnica',cuidado:'Confira se o conteúdo não envelheceu.',ver:['m01-biblioteca']},
 web:{n:'Serviço web',para:'Site que entrega o dado direto no navegador.',
  passos:['Abra no navegador do AVI.','Digite o dado no campo de busca e rode.','Compare com uma segunda ferramenta antes de concluir.'],
  io:'dado → resultado na tela',cuidado:'Você não sabe o que o site guarda do que você digitou. Não use dado sigiloso.',ver:['central']}
};
/* Dicas específicas: domínio → [tipo, dica] */
const H={
'google.com':['search','Ferramentas → Qualquer data para filtrar; “Imagens” para busca reversa via Lens. Teste <code>before:</code> e <code>after:</code> com datas.'],
'bing.com':['search','Bom para documentos e para imagens; aceita <code>site:</code>, <code>filetype:</code>, <code>inbody:</code> e <code>ip:</code> (sites num mesmo IP).'],
'yandex.com':['search','Forte em reconhecimento de rostos e lugares na busca por imagem; cobre bem Rússia e Leste Europeu.'],
'yandex.ru':['search','Forte em reconhecimento de rostos e lugares na busca por imagem.'],
'duckduckgo.com':['search','Não personaliza resultados; os “bangs” (<code>!g</code>, <code>!w</code>) levam a outros buscadores.'],
'startpage.com':['search','Resultados do Google sem rastreio; útil para buscar deslogado.'],
'search.brave.com':['search','Índice próprio, diferente do Google e do Bing — bom para achar o que eles não mostram.'],
'baidu.com':['search','Para conteúdo da China; escreva em chinês simplificado.'],
'mojeek.com':['search','Índice próprio e independente.'],
'exploit-db.com':['dork','Google Hacking Database: dorks catalogadas por categoria.'],
'dorksearch.com':['dork','Gera dorks por formulário.'],
'whatsmyname.app':['user','Mais de 600 sites; filtre por categoria e exporte CSV.'],
'namechk.com':['user','Verifica disponibilidade de username e domínio: “indisponível” sugere que existe conta.'],
'instantusername.com':['user','Checagem rápida em centenas de sites.'],
'github.com/sherlock-project':['cli','<code>pipx install sherlock-project</code> e depois <code>sherlock username</code>. Use <code>--print-found</code> e <code>--csv</code>.'],
'github.com/soxoj':['cli','Maigret: <code>pip install maigret</code>; <code>maigret username --html</code> gera relatório.'],
'github.com/megadose':['cli','Holehe: <code>pip install holehe</code>; <code>holehe email@x.com</code>. Ele usa o fluxo de recuperação de senha dos sites.'],
'epieos.com':['email','Mostra conta Google e serviços ligados a um e-mail ou telefone; parte paga.'],
'hunter.io':['email','Padrão de e-mail de uma empresa a partir do domínio; pede cadastro.'],
'haveibeenpwned.com':['leak','Em quais vazamentos públicos um e-mail aparece; não mostra senhas.'],
'dehashed.com':['leak','Busca em bases vazadas; pago para ver os registros.'],
'leakcheck.io':['leak','Vazamentos por e-mail, username ou domínio; gratuito limitado.'],
'intelx.io':['leak','Intelligence X: arquivos de vazamentos, pastes e darknet; cadastro e limites diários.'],
'whois.domaintools.com':['domain','WHOIS atual; o histórico é pago.'],
'registro.br':['domain','Fonte primária para .br: titular, CPF/CNPJ (quando pessoa jurídica), contatos e datas.'],
'who.is':['domain','WHOIS e DNS rápidos.'],
'viewdns.info':['domain','Canivete: reverse IP, histórico de IP, reverse WHOIS, ping.'],
'securitytrails.com':['domain','Histórico de DNS e subdomínios; cadastro gratuito.'],
'dnsdumpster.com':['domain','Mapa de subdomínios, MX e hosts de um domínio.'],
'crt.sh':['domain','Certificados emitidos para um domínio: revela subdomínios. Busque <code>%.dominio.com</code>.'],
'whoxy.com':['domain','Histórico de WHOIS e reverse WHOIS por e-mail ou nome.'],
'urlscan.io':['domain','Abre a URL num navegador deles e mostra prints, requisições e IPs — você não toca o site.'],
'virustotal.com':['domain','Reputação de URL, domínio, IP e arquivo; a aba Relations mostra vínculos.'],
'shodan.io':['ip','Dispositivos e serviços expostos por IP; filtros como <code>country:BR port:3389</code>. Cadastro.'],
'censys.io':['ip','Similar ao Shodan, forte em certificados.'],
'search.censys.io':['ip','Similar ao Shodan, forte em certificados.'],
'ipinfo.io':['ip','ASN, provedor, localização aproximada e se é VPN/hosting.'],
'abuseipdb.com':['ip','Denúncias de abuso ligadas a um IP.'],
'greynoise.io':['ip','Diz se o IP é “ruído” (scanner em massa) ou alvo dirigido.'],
'metrics.torproject.org':['ip','ExoneraTor: descobre se um IP era nó Tor numa data.'],
'web.archive.org':['archive','Wayback Machine: calendário de capturas; <code>web.archive.org/web/*/dominio.com*</code> lista todas as URLs.'],
'archive.org':['archive','Internet Archive: páginas, livros, vídeos e software antigos.'],
'archive.ph':['archive','archive.today: guarda a página como ela está agora, com print.'],
'archive.today':['archive','Guarda a página como ela está agora, com print.'],
'cachedview.com':['archive','Atalho para os caches do Google, Bing e Wayback.'],
'tineye.com':['rimg','Ordene por “Oldest” para achar a primeira aparição.'],
'pimeyes.com':['rimg','Reconhecimento facial na web aberta; pago e polêmico — use só com base legal.'],
'images.google.com':['rimg','Google Lens: bom para objetos e lugares; recorte a área.'],
'lens.google.com':['rimg','Recorte a área de interesse; aba “Correspondências exatas”.'],
'googlelens.imagesniper.eu':['rimg','Força a busca de imagem do Google a mostrar correspondências exatas.'],
'fotoforensics.com':['meta','ELA e metadados; envie o original. Compare áreas parecidas da foto.'],
'29a.ch':['meta','Forensically: ELA, clone detection, ruído e EXIF no navegador.'],
'exiftool.org':['meta','Linha de comando: <code>exiftool -a -G1 foto.jpg</code>; <code>-gps:all</code> só GPS.'],
'jimpl.com':['meta','EXIF on-line com mapa do GPS.'],
'invid-project.eu':['vid','Plugin InVID-WeVerify: quadros-chave, busca reversa e metadados de vídeo.'],
'citizenevidence.amnestyusa.org':['vid','YouTube DataViewer: data exata de upload e miniaturas para busca reversa.'],
'github.com/yt-dlp':['cli','<code>yt-dlp URL</code> baixa; <code>--write-info-json</code> guarda os metadados.'],
'earth.google.com':['geo','Google Earth: imagens históricas (ícone do relógio) e 3D.'],
'google.com/maps':['geo','Street View: arraste o boneco; data da captura no canto.'],
'mapillary.com':['geo','Fotos de rua colaborativas, onde o Street View não chega.'],
'suncalc.org':['geo','Posição do sol e sombra por hora e local: ajuda a datar uma foto.'],
'overpass-turbo.eu':['geo','Consulta o OpenStreetMap por características (ex.: igreja ao lado de posto).'],
'openstreetmap.org':['geo','Mapa colaborativo; detalhes que o Google não tem.'],
'apps.sentinel-hub.com':['geo','Imagens de satélite Sentinel recentes e gratuitas.'],
'zoom.earth':['geo','Satélite quase em tempo real e meteorologia.'],
'flightradar24.com':['transp','Voos ao vivo e histórico curto; matrícula da aeronave abre o histórico.'],
'adsbexchange.com':['transp','ADS-B sem filtro de bloqueio.'],
'marinetraffic.com':['transp','Navios por nome, IMO ou MMSI.'],
'opencorporates.com':['company','Empresas de muitos países; diretores e endereços.'],
'casadosdados.com.br':['company','CNPJ e sócios; filtro por CNAE e cidade.'],
'minhareceita.org':['company','API aberta: <code>minhareceita.org/CNPJ</code> devolve JSON com sócios e datas.'],
'solucoes.receita.fazenda.gov.br':['gov','Cartão CNPJ oficial; pode pedir captcha.'],
'portaldatransparencia.gov.br':['gov','Pessoa física: benefícios e vínculos com o governo federal; tem API.'],
'divulgacandcontas.tse.jus.br':['gov','Candidatos: bens declarados, doadores e despesas por eleição.'],
'queridodiario.ok.org.br':['gov','Busca em diários oficiais de municípios.'],
'jusbrasil.com.br':['people','Processos e diários; confira no tribunal de origem.'],
'escavador.com':['people','Processos e menções em diários oficiais por nome.'],
'familysearch.org':['people','Genealogia gratuita; registros civis e de imigração.'],
'blockchain.com':['chain','Comece por aqui: endereço, transações e saldo de BTC.'],
'blockchair.com':['chain','Várias blockchains; filtros e exportação.'],
'blockstream.info':['chain','Explorer de BTC limpo; bom para ver entradas e saídas.'],
'etherscan.io':['chain','Ethereum: transações, tokens e etiquetas de endereços conhecidos.'],
'walletexplorer.com':['chain','Agrupa endereços em carteiras e mostra etiquetas de serviços.'],
'oxt.me':['chain','Análise de transações BTC com heurísticas de troco.'],
'ahmia.fi':['search','Buscador de .onion com filtro de abuso; abre na web normal, os resultados só no Tor.'],
'torproject.org':['opsec','Baixe o Tor Browser só do site oficial e confira a assinatura.'],
'whonix.org':['opsec','Duas VMs: Gateway (Tor) e Workstation. Todo o tráfego passa pelo Tor.'],
'tails.net':['opsec','Sistema no pen drive que não guarda nada ao desligar.'],
'virtualbox.org':['opsec','VM gratuita; tire snapshot limpo antes de cada caso.'],
'maltego.com':['graph','Transforms que buscam dados e desenham o grafo; versão Community limitada.'],
'spiderfoot.net':['cli','Automatiza centenas de fontes; módulos passivos e ativos — escolha os passivos.'],
'osintframework.com':['col','Árvore de ferramentas por categoria; ver o buscador do Módulo 09.'],
'start.me':['col','Painéis de favoritos por tema; navegue pelos blocos.'],
'inteltechniques.com':['col','Ferramentas de busca do Michael Bazzell; liberar pop-ups. Ver Módulo 10.'],
'bellingcat.gitbook.io':['col','Toolkit da Bellingcat com notas de uso de cada ferramenta.'],
'socialblade.com':['socmint','Métricas históricas de perfis (YouTube, Instagram, TikTok, X).'],
'facebook.com':['social','ID numérico no código-fonte da página (<code>userID</code>) ou em ferramentas de ID.'],
'instagram.com':['social','Perfil privado mostra pouco; o ID não muda quando o @ muda.'],
'x.com':['social','Busca avançada: <code>from:</code>, <code>to:</code>, <code>since:</code>, <code>until:</code>. Pede login.'],
'twitter.com':['social','Busca avançada: <code>from:</code>, <code>since:</code>, <code>until:</code>. Pede login.'],
'tiktok.com':['social','O ID do vídeo carrega a data de publicação (ver lab de idade de conta no Módulo 04).'],
'linkedin.com':['social','Abrir perfil logado avisa o dono: use modo privativo do AVI.'],
'reddit.com':['social','Histórico de posts e comentários; <code>site:reddit.com</code> no Google ajuda.'],
't.me':['social','Telegram: canais públicos abrem no navegador em <code>t.me/s/canal</code>.'],
'telegram.org':['social','Canais públicos abrem no navegador em <code>t.me/s/canal</code>.'],
'discord.com':['social','O ID (snowflake) carrega a data de criação da conta.'],
'youtube.com':['vid','ID do vídeo na URL; a descrição completa e a data estão abaixo do player.'],
'chat.openai.com':['ai','Não cole dado pessoal do caso; peça as fontes.'],
'chatgpt.com':['ai','Não cole dado pessoal do caso; peça as fontes.'],
'claude.ai':['ai','Não cole dado pessoal do caso; confira cada afirmação.'],
'gemini.google.com':['ai','Não cole dado pessoal do caso; confira cada afirmação.'],
'huggingface.co':['ai','Modelos e datasets abertos; rode localmente para não enviar dados.'],
'play.google.com':['web','App de celular: instale num aparelho ou emulador do AVI, nunca no pessoal.'],
'drive.google.com':['web','Arquivo ou pasta compartilhada: baixe uma cópia e registre o link e a data.'],
'adstransparency.google.com':['web','Anúncios veiculados por um anunciante: busque pelo nome ou domínio e filtre por país e período.'],
'takeout.google.com':['opsec','Exporta os dados de uma conta Google sua: útil na autoauditoria.'],
'translate.google.com':['trans','Aceita foto (câmera) e documento.'],
'deepl.com':['trans','Tradução mais natural para textos longos.'],
'planalto.gov.br':['law','Texto compilado (com alterações) — use a versão “compilado”.'],
'scholar.google.com':['paper','Use “Citado por” e “Todas as versões” para achar o PDF aberto.'],
'dblp.org':['paper','Índice de computação: veículo e ano exatos da publicação.'],
'kaggle.com':['data','Baixe com conta; leia a aba Data e as discussões.'],
'netflix.com':['video','Documentário: confirme os fatos em fontes escritas.']
};
const RX=[
 [/\.onion\b/i,'onion'],[/chrome\.google\.com\/webstore|chromewebstore|addons\.mozilla\.org|microsoftedge\.microsoft\.com\/addons/i,'ext'],
 [/scholar\.google|dblp\.org|doi\.org|arxiv\.org|ieeexplore|dl\.acm\.org|springer|sciencedirect|researchgate|usenix\.org|ndss|petsymposium|mdpi\.com|semanticscholar/i,'paper'],
 [/kaggle\.com\/datasets|zenodo\.org|data\.world/i,'data'],
 [/planalto\.gov\.br\/ccivil|lexml|leis\.org/i,'law'],
 [/github\.com|gitlab\.com|pypi\.org|npmjs\.com|sourceforge\.net|bitbucket\.org/i,'cli'],
 [/start\.me|osintframework|awesome|toolkit|osint\.link|osintcombine|bellingcat\.gitbook|cipher387|technisette|metaosint/i,'col'],
 [/netflix\.com|primevideo|youtube\.com\/watch|youtu\.be|vimeo\.com|ted\.com/i,'video'],
 [/\.gov\.br|\.jus\.br|\.leg\.br|\.mp\.br|\.def\.br|\.mil\.br|tse\.|receita|cnj\.|stf\.|stj\./i,'gov'],
 [/\/noticia|\/news\/|\/article|\/blog\/|g1\.globo|oglobo|folha\.uol|estadao|uol\.com\.br|bbc\.|cnn|reuters|theguardian|nytimes|medium\.com|substack|wired\.com|krebsonsecurity|bleepingcomputer|therecord\.media|tecmundo|olhardigital|conjur|migalhas|metropoles|exame\.com|g1\./i,'news']
];
const KW=[
 [/dork|ghdb|operador/i,'dork'],[/vazament|breach|leak|pwned|credencia/i,'leak'],[/username|nome de usu|usuário|nick/i,'user'],
 [/e-?mail/i,'email'],[/telefon|phone|celular|whatsapp|imei|operadora|número/i,'phone'],
 [/whois|dns|domín|domain|subdom|certificad/i,'domain'],[/\bip\b|ips\b|asn|porta|shodan|scan/i,'ip'],
 [/arquiv|wayback|cache|archive/i,'archive'],[/reversa|reverse image|busca por imagem|reconhecimento facial|rosto/i,'rimg'],
 [/exif|metadad|forens|edição|deepfake|ela\b/i,'meta'],[/vídeo|video|youtube|frame/i,'vid'],
 [/mapa|satél|satel|geoloc|street|coorden|webcam|câmera/i,'geo'],[/voo|aeronave|navio|placa|veícul|detran|renavam|chassi/i,'transp'],
 [/cnpj|empresa|sócio|junta comercial|company/i,'company'],[/processo|tribunal|diário oficial|genealog|cartório|protesto/i,'people'],
 [/bitcoin|blockchain|cripto|carteira|ethereum|btc|eth\b|wallet/i,'chain'],[/tor\b|vpn|proxy|navegador|máquina virtual|\bvm\b|anonimato|opsec/i,'opsec'],
 [/vínculo|grafo|link analysis|maltego/i,'graph'],[/\bia\b|inteligência artificial|llm|gpt|chatbot/i,'ai'],[/tradu/i,'trans'],
 [/instagram|tiktok|facebook|twitter|\bx\b|linkedin|telegram|discord|reddit|kwai|socmint|redes sociais/i,'socmint'],
 [/buscador|mecanismo de busca|search engine/i,'search'],[/lei |decreto|código penal|lgpd|constituição/i,'law'],
 [/\b(livro|curso|ebook|apostila|treinamento)\b/i,'course']
];
const SOC=/^(facebook\.com|instagram\.com|x\.com|twitter\.com|tiktok\.com|linkedin\.com|reddit\.com|t\.me|discord\.com|kwai\.com|vk\.com|threads\.net|pinterest\.com|snapchat\.com|youtube\.com)$/;
const GK={P:'paper',S:'paper',L:'paper',R:'paper',B:'data',D:'data',T:'cli',F:'gov',C:'news',V:'video',K:'course',J:'law'};
function tip(u){const h=host(u);const p=(u||'').replace(/^https?:\/\/(www\.)?/,'').toLowerCase();
  for(const k in H){if(k.includes('/')){if(p.startsWith(k))return H[k]}}
  if(H[h])return H[h];const UMB={'google.com':1,'yandex.com':1,'yandex.ru':1,'bing.com':1,'archive.org':1,'youtube.com':1};const parts=h.split('.');for(let i=1;i<parts.length-1;i++){const s=parts.slice(i).join('.');if(H[s]&&!UMB[s])return H[s]}return null}
function classify(e){
  if(e.k&&GK[e.k]){let k=GK[e.k];if(e.k==='T'&&!/github|pypi|gitlab/i.test(e.u||''))k=/whonix|tails|tor/i.test(e.t)?'opsec':'web';if(e.k==='F'&&!/gov\.br|jus\.br/.test(e.u||''))k='web';return k}
  const u=e.u||'',h=host(u),txt=(e.t+' '+e.d+' '+e.s);
  if(/\.onion\b/i.test(u))return 'onion';if(RX[1][0].test(u))return 'ext';
  const t=tip(u);if(t&&t[0])return t[0];
  for(const [r,k] of RX)if(r.test(u))return k;
  if(SOC.test(h))return 'social';
  if(/\(T\)/.test(e.t)||/pip install|linha de comando|terminal|instal[aá]vel|\bCLI\b/i.test(txt))return 'cli';
  if(/\(D\)/.test(e.t))return 'dork';
  for(const [r,k] of KW)if(k!=='course'&&r.test(e.t+' '+e.d))return k;
  if(KW[KW.length-1][0].test(e.t))return 'course';
  if(e.p)for(const [r,k] of KW)if(k!=='course'&&r.test(e.p))return k;
  if(!/^(Laboratório: buscar|Mapa do Módulo|Livro-base)/.test(e.s||''))for(const [r,k] of KW)if(k!=='course'&&r.test(e.s))return k;
  return 'web';
}
function flags(e,el){const f=[];const g=(e.g||'')+' '+(el?el.textContent:'');
  if(/fora do ar/i.test(g))f.push(`<b>Fora do ar na revisão.</b> Tente a última versão arquivada: <a href="https://web.archive.org/web/*/${esc(e.u)}">Wayback</a>, ou procure uma alternativa na mesma seção.`);
  if(/\bpago\b|freemium|paid/i.test(g))f.push('<b>Tem parte paga.</b> Veja o que a versão gratuita entrega antes de assinar.');
  if(/\(R\)/.test(e.t)||/cadastro|requer login|exige login/i.test(e.g||''))f.push('<b>Pede cadastro.</b> Use a conta e o e-mail do AVI.');
  if(/toca o alvo/i.test(g))f.push('<b>Toca o alvo.</b> A ferramenta faz requisições aos serviços pesquisados: o alvo pode ver a origem. Rode na VM, de preferência via proxy ou Tor.');
  if(/\(M\)/.test(e.t))f.push('<b>Edite o link à mão.</b> A URL tem um trecho a trocar pelo seu dado.');
  if(el){const io=el.querySelector('.bcm');if(io&&/Entrada:/.test(io.textContent))f.push(esc(io.textContent));const ox=el.querySelector('.bcx');if(ox&&/^OPSEC/.test(ox.textContent))f.push(esc(ox.textContent))}
  return f}
function html(e,el){const k=classify(e),G=K[k]||K.web,t=tip(e.u);
  const ver=G.ver.filter(a=>document.getElementById(a)||/^(central|biblia)$/.test(a)).map(a=>`<a href="#${a}">${a.replace(/^m(\d\d)-/,'M$1 · ')}</a>`).join(' · ');
  const fl=flags(e,el);
  return `<div class="gmeta"><span class="tag">${esc(G.n)}</span>${e.s?` <span class="progtxt">em: ${e.a?`<a href="${esc(e.a.startsWith('#')?e.a:'#'+e.a)}">${esc(e.s)}</a>`:esc(e.s)}${e.p?' › '+esc(e.p):''}</span>`:''}</div>
<h3>${esc(e.t||host(e.u))}</h3>${e.d?`<p class="progtxt">${esc(e.d.length>300?e.d.slice(0,300)+'…':e.d)}</p>`:''}
<p><b>Para quê.</b> ${G.para}</p>${t&&t[1]?`<div class="call tip"><b>Dica deste serviço</b>${t[1]}</div>`:''}
<p><b>Passo a passo</b></p><ol>${G.passos.map(p=>`<li>${p}</li>`).join('')}</ol>
<p><b>Entrada → saída.</b> ${esc(G.io)}</p>
${fl.length?`<div class="call warn"><b>Etiquetas desta fonte</b>${fl.join('<br>')}</div>`:''}
<p><b>Cuidado.</b> ${G.cuidado}</p><p><b>Registro.</b> ${REG}</p>
${ver?`<p class="progtxt">Aprenda no hub: ${ver}</p>`:''}
<div class="done-row">${e.u?`<a class="btn pri" href="${esc(e.u)}" target="_blank" rel="noopener">Abrir a fonte</a><a class="btn" href="https://web.archive.org/web/*/${esc(e.u)}" target="_blank" rel="noopener">Ver no Wayback</a>`:''}<button class="btn" data-gclose>Fechar</button></div>`}
let dlg;function open(e,el){if(!dlg){dlg=document.createElement('div');dlg.id='gdlg';dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.innerHTML='<div class="card" tabindex="-1"></div>';document.body.appendChild(dlg);
  dlg.addEventListener('click',ev=>{if(ev.target===dlg||ev.target.closest('[data-gclose]')||ev.target.closest('.card a[href^="#"]'))close()});document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&dlg.classList.contains('on'))close()})}
  const c=dlg.querySelector('.card');c.innerHTML=html(e,el);dlg.classList.add('on');c.scrollTop=0;c.focus()}
function close(){dlg&&dlg.classList.remove('on')}
function fromCard(card){const a=card.querySelector('a.t')||card.querySelector('a[href^="http"]');if(!a)return null;const sec=card.closest('section');const h2=sec&&sec.querySelector('h2');const p=card.querySelector('p');
  const tg=card.querySelector('.tag.lin,.tag.off,.tag.pago')||card.querySelector('.tag');
  let ctx='';let x=card;while(x&&x!==sec&&!ctx){let y=x.previousElementSibling;while(y&&!ctx){if(/^H[34]$/.test(y.tagName))ctx=y.textContent.trim();else{const hh=y.querySelectorAll&&y.querySelectorAll('h3,h4');if(hh&&hh.length)ctx=hh[hh.length-1].textContent.trim()}y=y.previousElementSibling}x=x.parentElement}
  const dd=card.closest('details.osfcat');if(dd){const sm=dd.querySelector('summary');ctx=(sm?sm.textContent.trim()+' › ':'')+ctx}
  return {u:a.href,t:a.textContent.trim(),d:p?p.textContent.trim():'',s:h2?h2.textContent.replace(/^\s*\S+\s+/,'').trim():'',p:ctx.slice(0,90),a:sec?sec.id:'',g:tg?tg.textContent:'',k:card.dataset.gk||''}}
function decorate(root){(root||document).querySelectorAll('.tool').forEach(c=>{if(c.querySelector(':scope > .gbtn'))return;const a=c.querySelector('a.t, a[href^="http"]');if(!a)return;const b=document.createElement('button');b.className='btn gbtn';b.type='button';b.textContent='Como usar';b.setAttribute('aria-label','Como usar: '+a.textContent.trim());c.appendChild(b)})}
document.addEventListener('click',ev=>{const b=ev.target.closest('.gbtn');if(!b)return;ev.preventDefault();
  if(b.dataset.gu!==undefined||b.dataset.gt){open({u:b.dataset.gu,t:b.dataset.gt,d:b.dataset.gd||'',s:b.dataset.gs||'',p:b.dataset.gp||'',a:b.dataset.ga||'',g:b.dataset.gg||'',k:b.dataset.gk||''},null);return}
  const c=b.closest('.tool');const e=c&&fromCard(c);if(e)open(e,c)});
/* aba "Guias de uso" na Bíblia */
function renderTab(box){const B=(window.BIB||[]).filter(x=>/^https?:/.test(x.u));const counts={};B.forEach(x=>{const k=classify(x);counts[k]=(counts[k]||0)+1});
  box.innerHTML=`<p class="lead">Um mini guia para cada uma das ${B.length} fontes. Filtre pelo tipo de fonte ou busque pelo nome; o botão abre o guia.</p>
<div class="form builder"><div><label for="gq">Buscar</label><input id="gq" placeholder="ex.: whois, exif, cnpj, tor"></div><div><label for="gk">Tipo de fonte</label><select id="gk"><option value="">Todos</option>${Object.keys(K).filter(k=>counts[k]).sort((a,b)=>counts[b]-counts[a]).map(k=>`<option value="${k}">${esc(K[k].n)} (${counts[k]})</option>`).join('')}</select></div></div>
<p class="progtxt" id="gn"></p><div id="gl"></div>`;
  const draw=()=>{const q=document.getElementById('gq').value.toLowerCase(),kk=document.getElementById('gk').value;const f=B.filter(x=>(!kk||classify(x)===kk)&&(!q||(x.t+' '+x.u+' '+x.d+' '+x.s).toLowerCase().includes(q)));
    document.getElementById('gn').textContent=`${f.length} fontes`+(f.length>400?' — mostrando 400; refine a busca':'');
    document.getElementById('gl').innerHTML='<table class="bt"><tr><th>Fonte</th><th>Tipo</th><th></th></tr>'+f.slice(0,400).map(x=>{const k=classify(x);return `<tr><td><a href="${esc(x.u)}">${esc(x.t)}</a><div class="progtxt">${esc(x.m)} · <a href="#${esc(x.a)}">${esc(x.s)}</a></div></td><td>${esc(K[k].n)}</td><td><button class="btn gbtn" data-gu="${esc(x.u)}" data-gt="${esc(x.t)}" data-gd="${esc(x.d||'')}" data-gs="${esc(x.s||'')}" data-ga="${esc(x.a||'')}" data-gg="${esc(x.g||'')}" data-gp="${esc(x.p||'')}" data-gk="${esc(x.k||'')}">Como usar</button></td></tr>`}).join('')+'</table>'};
  document.getElementById('gq').oninput=draw;document.getElementById('gk').onchange=draw;draw()}
window.GUIA={classify,html,open,decorate,renderTab,KINDS:K,TIPS:H};
const go=()=>decorate(document);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
