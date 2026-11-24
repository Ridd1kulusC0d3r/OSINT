window.ROTEIROS=[
 {id:'boato',ic:'?',t:'Preciso checar um boato ou notícia',d:'Origem, data, contexto e quem publicou primeiro.',steps:[
  ['Escreva a pergunta','O que exatamente precisa ser confirmado ou descartado.','m12-metodo'],
  ['Procure checagens existentes','Buscador de checagens e agências brasileiras.','m13-buscadores-e-arquivos-buscadores-de-checagem'],
  ['Ache a publicação mais antiga','Mesma busca em dois buscadores, filtrando por data.','m13-buscadores-e-arquivos'],
  ['Separe reprodução de confirmação','Quem apurou e quem só repetiu.','m15-lab-02'],
  ['Preserve o que for usado','Captura, arquivo público e hash.','m01-preservacao'],
  ['Registre o grau de confiança','Fonte e informação graduadas.','m01-validade']]},
 {id:'imagem',ic:'▢',t:'Tenho uma foto',d:'Origem, data, local e contexto.',steps:[
  ['Preserve o original','Arquivo como recebido, URL, data e hash.','m01-preservacao'],
  ['Descreva antes de concluir','Relevo, placas, idioma, clima, sombras.','m13-mapas-e-imagens'],
  ['Busca reversa em vários motores','A cópia mais antiga costuma levar à origem.','m13-mapas-e-imagens-busca-reversa-de-imagens'],
  ['Leia os metadados','Pista, não prova: podem ser editados.','m13-mapas-e-imagens-metadados'],
  ['Confirme o local por duas vistas','Satélite e imagem de rua.','m13-mapas-e-imagens-google-maps-e-google-earth'],
  ['Teste a data','Sombra, clima e imagens históricas.','m13-mapas-e-imagens-suncalc'],
  ['Pratique','Lab 06 · Validação visual.','m15-lab-06']]},
 {id:'post',ic:'◎',t:'Tenho uma publicação de rede social',d:'Confirmar autor, data e contexto, e preservar.',steps:[
  ['Preserve antes de analisar','Link permanente, captura com data e hash.','m01-preservacao'],
  ['Confirme a conta','Vínculo a partir do site oficial da instituição.','m13-redes-sociais'],
  ['Ache a versão original','Repostagens e cortes perdem contexto.','m13-redes-sociais'],
  ['Verifique edição e correções','Indicador de edição, notas da comunidade, checagens.','m13-redes-sociais'],
  ['Registre a data correta','Evento, publicação, edição e consulta.','m12-dados-e-proveniencia']]},
 {id:'site',ic:'⌘',t:'Tenho um site ou domínio suspeito',d:'Quem registrou, desde quando e como a página mudou.',steps:[
  ['Leia a URL','Domínio registrado, subdomínio, caminho.','m02-b-operadores'],
  ['Consulte o registro','Registro.br para .br; ICANN Lookup para os demais.','m13-registros-publicos-br-dominios-br'],
  ['Veja as versões antigas','Wayback e archive.today.','m13-buscadores-e-arquivos-wayback-machine-internet-archive'],
  ['Use a Central','Cole o domínio para os caminhos de verificação.','central'],
  ['Registre e relate','Achados com fonte e data.','m01-modelos']]},
 {id:'empresa',ic:'▤',t:'Due diligence de uma empresa',d:'Dados oficiais antes de contratar ou denunciar.',steps:[
  ['Situação cadastral','Comprovante oficial do CNPJ.','m13-registros-publicos-br-empresas'],
  ['Sanções e contratos','Portal da Transparência e PNCP.','m13-registros-publicos-br-governo-contratos-e-gastos'],
  ['Processos públicos','Consulta processual dos tribunais.','m13-registros-publicos-br-justica'],
  ['Marcas e registros','INPI e Juntas Comerciais.','m13-registros-publicos-br-empresas'],
  ['Hipóteses e lacunas','Matriz de hipóteses.','m15-tpl-matriz-de-hipoteses']]},
 {id:'publico',ic:'⚖',t:'Checar o uso de dinheiro público',d:'Contratos, repasses e quem recebeu.',steps:[
  ['Portal da Transparência','Despesas, convênios e favorecidos.','m13-registros-publicos-br-governo-contratos-e-gastos'],
  ['Diários oficiais','DOU e Querido Diário.','m13-registros-publicos-br-governo-contratos-e-gastos'],
  ['Pedido pela LAI','Quando o dado não estiver aberto.','m13-registros-publicos-br-lei-de-acesso-a-informacao'],
  ['Relatório','Resposta, evidências e limites.','m15-tpl-relatorio']]},
 {id:'cti',ic:'⚑',t:'Um boletim cita um incidente',d:'Saber se afeta o seu ambiente.',steps:[
  ['Leia o método de CTI','Fonte, indicador e relevância.','m14-osint-cti'],
  ['Pratique','Lab 05 · OSINT para CTI.','m15-lab-05'],
  ['Contexto da Dark Web','Postura passiva e regras de mergulho.','m11-a-zonas']]},
 {id:'preservar',ic:'▣',t:'Preciso preservar um conteúdo agora',d:'Quando a página pode sumir a qualquer minuto.',steps:[
  ['Capture a tela inteira','Com URL e relógio visíveis.','m01-preservacao'],
  ['Arquive publicamente','Save Page Now ou archive.today.','m13-buscadores-e-arquivos-wayback-machine-internet-archive'],
  ['Calcule o hash','Script de custódia.','m01-preservacao'],
  ['Preencha a ficha de coleta','Quem, quando, como, com qual ambiente.','m01-modelos']]},
 {id:'relatorio',ic:'✓',t:'Vou fechar o relatório',d:'Do achado ao documento que se sustenta.',steps:[
  ['Resposta primeiro','Duas ou três frases com o grau de confiança.','m15-tpl-relatorio'],
  ['Evidências graduadas','Fonte e informação em cada achado.','m01-validade'],
  ['Hipóteses concorrentes','O que mudaria a conclusão.','m12-analise-estruturada'],
  ['Lacunas e limites','O que não foi possível confirmar.','m12-qualidade-e-etica']]}
];
