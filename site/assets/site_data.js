window.WAIT=[];
window.LABS=[
 ['Modelos de relatório e ficha de coleta','Relatório de inteligência e ficha de coleta preenchíveis, prontos para copiar.','m01-modelos','FUNDAMENTOS'],
 ['Script de custódia','Hash SHA-256 e registro de evidências de uma pasta, em Python só com biblioteca padrão.','m01-preservacao','FUNDAMENTOS'],
 ['Construtor de buscas e dorks','Monta a consulta com operadores e abre em vários buscadores.','m02-lab-dork','BUSCA'],
 ['Lab 01 · Evidências','Registro de evidências com proveniência.','m15-lab-01','LABORATÓRIOS'],
 ['Lab 02 · Três fontes, uma origem','Independência de fontes.','m15-lab-02','LABORATÓRIOS'],
 ['Lab 03 · Verificação temporal','Datas, versões e fusos.','m15-lab-03','LABORATÓRIOS'],
 ['Lab 04 · Qualidade de fontes','Origem, credibilidade e hipótese.','m15-lab-04','LABORATÓRIOS'],
 ['Lab 05 · OSINT para CTI','Nota defensiva com evidências.','m15-lab-05','LABORATÓRIOS'],
 ['Lab 06 · Validação visual','Local e data de uma imagem.','m15-lab-06','LABORATÓRIOS'],
 ['Buscar no OSINT Framework','As ferramentas do OSINT Framework filtráveis por categoria, status, custo, cadastro, instalação e OPSEC.','m09-lab-osf','ATLAS'],
 ['Plano de estudo do OSINT Techniques','Os 47 capítulos do livro ligados às seções do hub.','m10-lab-livro','BAZZELL'],
 ['Biblioteca da Dark Web','196 leituras, ferramentas e datasets com filtro e status de leitura.','m11-lab-bib','DARK WEB']
];
window.FAQ_EXTRA=[
 ['Por que este site não pesquisa CPF, telefone, e-mail ou username?','Porque a edição pública segue a política editorial do repositório: o foco é verificar conteúdo e consultar registros oficiais, não localizar ou expor pessoas. Os guias por plataforma mostram o que é público e como preservar.','Todos','m12-qualidade-e-etica'],
 ['Fonte aberta é fonte livre?','Não. Dado pessoal continua protegido pela LGPD, conteúdo tem direitos autorais e as plataformas têm termos de uso.','Ética','m12-qualidade-e-etica'],
 ['Duas notícias iguais são duas confirmações?','Só se tiverem apurações independentes. Reprodução não é confirmação.','Verificação','m15-lab-02'],
 ['Hash prova que o conteúdo é verdadeiro?','Não. Hash atesta que o arquivo não mudou desde a coleta, não que o conteúdo é verdadeiro.','Proveniência','m01-preservacao'],
 ['Como saber se uma conta de rede social é oficial?','Procure o vínculo a partir do site oficial da instituição e confira o histórico da conta; o selo sozinho não basta.','Plataformas','m13-redes-sociais'],
 ['Como achar a primeira publicação de uma imagem?','Busca reversa em mais de um motor, ordenando pela data mais antiga, e conferência no arquivo da web.','Plataformas','m13-mapas-e-imagens-busca-reversa-de-imagens'],
 ['O que é o botão “Como usar”?','Um mini guia da fonte: para que serve, passo a passo, entrada e saída, cuidados de OPSEC e o que registrar. Todos estão também na aba “Guias de uso”.','Todos','biblia'],
 ['Posso reutilizar o OSINT Framework?','Sim: é licença MIT. Mantenha o aviso de copyright, como faz este site.','Atlas','m09-c-osf'],
 ['Encontrei um painel ou arquivo exposto. Posso abrir?','Não. Registre e, se for o caso, notifique o responsável. Acessar sistema sem autorização é crime (Lei 12.737/2012).','Busca','m02-b-dorks']
];
window.LAWS=[
 ['Lei 12.527/2011 — LAI','Acesso à informação: publicidade como regra e sigilo como exceção; prazo de 20 dias, prorrogável por 10.',['m13-registros-publicos-br-lei-de-acesso-a-informacao','m01-validade']],
 ['Lei 13.709/2018 — LGPD','Dado pessoal exige base legal, finalidade e minimização; dado biométrico é sensível.',['m12-qualidade-e-etica','m13-mapas-e-imagens-busca-reversa-de-imagens']],
 ['Lei 12.965/2014 — Marco Civil da Internet','Guarda de registros de conexão (1 ano) e de aplicação (6 meses); fornecimento mediante ordem judicial.',['m01-historico']],
 ['Código Penal, art. 307','Falsa identidade: atribuir-se identidade falsa para obter vantagem ou causar dano.',['m02-avi-limites']],
 ['Lei 12.737/2012','Invasão de dispositivo informático: acessar sistema sem autorização é crime, mesmo com senha exposta.',['m02-b-dorks','m01-validade']],
 ['Lei 12.850/2013, art. 10-A · Lei 13.441/2017','Infiltração virtual de agentes depende de autorização judicial.',['m02-avi-limites']],
 ['CPP, arts. 158-A a 158-F','Cadeia de custódia da prova.',['m01-preservacao','m12-dados-e-proveniencia']]
];
window.BOOK={title:'',sub:'',parts:[]};
window.TRAIN={title:'Trilha de estudo — OSINT com método',sub:'Uma trilha em oito encontros que percorre os módulos deste site, do ambiente ao relatório.',
meta:[['Público','Quem quer aprender OSINT com método: analistas, investigadores, jornalistas, equipes de segurança e compliance.'],
 ['Pré-requisitos','Navegação básica; os scripts em Python são opcionais.'],
 ['Formato','Encontros de 2 h com laboratório guiado e uma missão para casa.'],
 ['Princípios','Ética e legalidade primeiro; postura passiva; tudo registrado e preservado.']],
enc:[
 {id:'E1',t:'Fundamentos e ambiente',h:2,src:['m01-conceito','m01-ciclo','m01-vm'],obj:['Formular a pergunta','Montar o ambiente'],c:'Dado, informação e conhecimento; ciclo; VM e navegador de trabalho.',lab:'Montar a VM e testar o navegador.',ent:'Pergunta em uma linha e print do teste de navegador.',av:'Checklist de ambiente.'},
 {id:'E2',t:'Método e avaliação de fontes',h:2,src:['m12-metodo','m12-avaliacao-de-fontes'],obj:['Aplicar o método de seis etapas','Avaliar fontes com VISTA'],c:'Método operacional e avaliação VISTA.',lab:'Lab 01 · Evidências.',ent:'Registro de evidências.',av:'Rubrica do Lab 01.'},
 {id:'E3',t:'Verificação e independência',h:2,src:['m12-verificacao','m15-lab-02'],obj:['Separar reprodução de confirmação'],c:'Verificação e cadeia de dependência.',lab:'Lab 02 · Três fontes, uma origem.',ent:'Conclusão de até 120 palavras.',av:'Rubrica do Lab 02.'},
 {id:'E4',t:'Busca e arquivos da web',h:2,src:['m02-b-operadores','m13-buscadores-e-arquivos'],obj:['Chegar à publicação mais antiga'],c:'Operadores, dorks e arquivos da web.',lab:'Lab 03 · Verificação temporal.',ent:'Linha do tempo com fontes.',av:'Rubrica do Lab 03.'},
 {id:'E5',t:'Plataformas e registros públicos',h:2,src:['m13-redes-sociais','m13-registros-publicos-br'],obj:['Verificar uma publicação','Consultar um registro oficial'],c:'Guias por plataforma.',lab:'Lab 04 · Qualidade de fontes.',ent:'Ficha de verificação.',av:'Rubrica do Lab 04.'},
 {id:'E6',t:'Imagens, mapas e datas',h:2,src:['m13-mapas-e-imagens','m14-geoint-imint'],obj:['Confirmar local e data de uma imagem'],c:'Busca reversa, metadados, satélite e sombra.',lab:'Lab 06 · Validação visual.',ent:'Coordenadas e justificativa.',av:'Rubrica do Lab 06.'},
 {id:'E7',t:'OSINT para CTI',h:2,src:['m14-osint-cti','m11-a-zonas'],obj:['Produzir nota defensiva'],c:'CTI com fontes abertas e o mapa da Dark Web.',lab:'Lab 05 · OSINT para CTI.',ent:'Nota defensiva.',av:'Rubrica do Lab 05.'},
 {id:'E8',t:'Análise e relatório',h:2,src:['m12-analise-estruturada','m15-tpl-relatorio'],obj:['Testar hipóteses','Entregar relatório revisável'],c:'Hipóteses concorrentes e modelo de relatório.',lab:'Caso final com os modelos.',ent:'Relatório com contraevidência.',av:'Rubrica comum de 10 pontos.'}],
kit:['Máquina virtual com snapshot limpo','Navegador de trabalho testado','Pasta do caso e ficha de coleta','Script de custódia','Modelos de relatório'],
rub:[['Pergunta e escopo','20','Pergunta clara, escopo e limites legais explícitos.'],['Origem e contexto','20','Cada achado com fonte, data e contexto.'],['Independência','20','Independência e contraevidência avaliadas.'],['Hipóteses','20','Hipóteses separadas de observações.'],['Conclusão','20','Conclusão limitada, reproduzível e com lacunas declaradas.']]};
