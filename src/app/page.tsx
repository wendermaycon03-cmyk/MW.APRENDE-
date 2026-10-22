"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

const subjects = [
  { name:"Português", icon:"✍️", color:"#e6f0ff", topics:"Interpretação, gramática, ortografia e redação", level:"Do básico ao avançado" },
  { name:"Matemática", icon:"➗", color:"#e4f7e9", topics:"Operações, frações, porcentagem e equações", level:"Do básico ao avançado" },
  { name:"Ciências e Biologia", icon:"🧬", color:"#e5f8f5", topics:"Corpo humano, natureza, células e ecologia", level:"Fundamental e médio" },
  { name:"História", icon:"🏛️", color:"#fff0d7", topics:"Brasil, mundo antigo, moderno e contemporâneo", level:"Todas as etapas" },
  { name:"Geografia", icon:"🌎", color:"#e7efff", topics:"Mapas, clima, população e economia", level:"Todas as etapas" },
  { name:"Física e Química", icon:"⚗️", color:"#f0e8ff", topics:"Energia, matéria, movimentos e reações", level:"Ensino médio" },
  { name:"Inglês e Espanhol", icon:"🌐", color:"#ffe8ee", topics:"Vocabulário, leitura e conversação", level:"Iniciante ao avançado" },
  { name:"Filosofia e Sociologia", icon:"💭", color:"#f1edff", topics:"Pensamento crítico, sociedade e cidadania", level:"Ensino médio" },
  { name:"Computação e Tecnologia", icon:"💻", color:"#e9f4ff", topics:"Informática básica, internet, programação, segurança digital e inteligência artificial", level:"Do zero ao avançado" },
  { name:"Educação financeira", icon:"💰", color:"#fff4df", topics:"Orçamento, poupança, juros e planejamento financeiro", level:"Aprendizado prático" }
];

const computerLessons = [
  { title:"Conhecendo o computador", detail:"Mouse, teclado, monitor e gabinete", level:"Iniciante", time:"10 min" },
  { title:"Windows e organização de arquivos", detail:"Pastas, downloads, copiar, colar e atalhos", level:"Iniciante", time:"15 min" },
  { title:"Internet e e-mail com segurança", detail:"Navegadores, pesquisas e golpes digitais", level:"Iniciante", time:"12 min" },
  { title:"Word ou editor de textos", detail:"Criar, formatar e salvar documentos", level:"Básico", time:"20 min" },
  { title:"Excel do zero", detail:"Células, tabelas, soma e fórmulas simples", level:"Básico", time:"20 min" },
  { title:"Primeiros passos na programação", detail:"Lógica, variáveis e comandos simples", level:"Intermediário", time:"18 min" },
  { title:"Inteligência artificial na prática", detail:"Como pedir ajuda à IA e conferir respostas", level:"Intermediário", time:"12 min" }
];
const lessons = [
  { title:"Como identificar a ideia principal de um texto", subject:"Português", time:"8 min" },
  { title:"Adição, subtração, multiplicação e divisão", subject:"Matemática", time:"12 min" },
  { title:"Porcentagem no dia a dia", subject:"Matemática", time:"10 min" }
];

export default function Home() {
  const [modal,setModal] = useState<"login"|"signup"|"quiz"|"ai"|null>(null);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [level,setLevel] = useState("Quero aprender desde o básico");
  const [message,setMessage] = useState("");
  const [question,setQuestion] = useState("Quanto é 25% de 80?");
  const [answer,setAnswer] = useState("");
  const [chatQuestion,setChatQuestion] = useState("");
  const [chatAnswer,setChatAnswer] = useState("");
  const [busy,setBusy] = useState(false);
  const [completed,setCompleted] = useState<string[]>([]);
  const supabase = createClient();

  async function auth(mode:"login"|"signup") {
    setBusy(true); setMessage("");
    if (!supabase) { setMessage("Para ativar o cadastro, configure as chaves do Supabase no arquivo .env.local. Veja o README."); setBusy(false); return; }
    const result = mode==="signup"
      ? await supabase.auth.signUp({email,password,options:{data:{full_name:name,study_level:level}}})
      : await supabase.auth.signInWithPassword({email,password});
    if (result.error) setMessage(result.error.message);
    else setMessage(mode==="signup" ? "Cadastro iniciado! Confira seu e-mail se a confirmação estiver ativada." : "Login realizado. Seu ambiente de estudos está pronto.");
    setBusy(false);
  }
  async function askTeacher() {
    setBusy(true); setChatAnswer("");
    try {
      const res = await fetch("/api/tutor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:chatQuestion,level})});
      const data = await res.json();
      setChatAnswer(data.answer || data.error || "Não consegui responder agora.");
    } catch { setChatAnswer("Não foi possível conectar ao professor virtual. Configure a chave da API no servidor e tente novamente."); }
    setBusy(false);
  }
  const quizCorrect = answer.trim().toLowerCase()==="20";
  return <main>
    <header className="topbar"><div className="shell nav">
      <a className="brand" href="#"><span className="logo">🎓</span><span>MW Aprende<small style={{display:"block",fontSize:11,fontWeight:400,color:"#d6e1ef",marginTop:3}}>Conhecimento para transformar o futuro</small></span></a>
      <nav className="navlinks"><a href="#materias">Matérias</a><a href="#computacao">Computação</a><a href="#aulas">Aulas</a><a href="#progresso">Meu progresso</a><a href="#professor">Professor IA</a></nav>
      <button className="btn" onClick={()=>{setModal("login");setMessage("")}}>Entrar</button>
    </div></header>
    <div className="shell">
      <section className="hero">
        <div><div className="eyebrow">Educação para todas as idades</div><h1>Aprenda hoje. Abra novas possibilidades amanhã.</h1><p>Uma experiência de estudo moderna para desenvolver conhecimentos escolares e habilidades digitais, do primeiro passo à preparação para provas.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}><button className="btn" onClick={()=>{setModal("signup");setMessage("")}}>Criar minha conta gratuita →</button><a className="btn secondary" href="#materias">Explorar matérias</a></div>
          <p style={{fontSize:12,marginTop:18}}>✓ Gratuito para alunos · ✓ Aulas por nível · ✓ Aprenda no celular</p>
        </div>
        <div className="hero-art"><div className="hero-icon">📚</div></div>
      </section>

      <section className="stats" id="progresso">
        <div className="stat"><span className="muted">Aulas concluídas nesta visita</span><strong>{completed.length}</strong><span className="pill">Continue aprendendo</span></div>
        <div className="stat"><span className="muted">Matérias disponíveis</span><strong>9 áreas</strong><span className="pill">Novos conteúdos por etapas</span></div>
        <div className="stat"><span className="muted">Seu objetivo</span><strong>1% melhor</strong><span className="muted" style={{fontSize:13}}>Um passo de cada vez.</span></div>
      </section>

      <section id="materias">
        <div className="section-head"><div><div className="eyebrow" style={{color:"#8b650b"}}>Explore e descubra</div><h2>O que você quer aprender hoje?</h2><div className="muted" style={{marginTop:7}}>Escolha uma matéria e comece pelo conteúdo que faz sentido para você.</div></div></div>
        <div className="grid">{subjects.map(s=><article className="card" key={s.name}><div className="subject-icon" style={{background:s.color}}>{s.icon}</div><h3>{s.name}</h3><p>{s.topics}</p><span className="pill">{s.level}</span><div style={{marginTop:18}}><button className="btn secondary" onClick={()=>{setQuestion(s.name==="Matemática"?"Quanto é 25% de 80?":`Explique um conceito básico de ${s.name} com um exemplo.`);setModal("quiz");setAnswer("");setMessage("")}}>Começar a estudar →</button></div></article>)}</div>
      </section>

      <section id="computacao">
        <div className="section-head"><div><div className="eyebrow" style={{color:"#8b650b"}}>Habilidades para a vida e para o trabalho</div><h2>Curso de computação do zero</h2><div className="muted" style={{marginTop:7}}>Aprenda a usar o computador mesmo que nunca tenha feito um curso.</div></div><span className="pill">7 trilhas de aprendizagem</span></div>
        <div className="computer-banner">
          <div className="computer-banner-icon">⌨️</div>
          <div className="computer-banner-copy"><h3>Do primeiro clique à programação</h3><p>Comece com mouse, teclado e arquivos. Depois avance para internet segura, documentos, planilhas, programação e inteligência artificial.</p><div className="computer-tags"><span>Informática básica</span><span>Word e Excel</span><span>Programação</span><span>Inteligência artificial</span></div></div>
        </div>
        <div className="grid computer-grid">{computerLessons.map((l,i)=><article className="card computer-card" key={l.title}><div className="computer-card-top"><span className="lesson-number">{String(i+1).padStart(2,"0")}</span><span className="pill">{l.level}</span></div><h3>{l.title}</h3><p>{l.detail}</p><div className="computer-card-bottom"><span className="muted">◷ {l.time}</span><button className="btn secondary" onClick={()=>{setQuestion("Me ensine a aula: "+l.title+". Explique para uma pessoa iniciante, em português simples, com passos numerados e um exercício prático.");setModal("ai");setChatQuestion("Me ensine a aula: "+l.title+". Explique para uma pessoa iniciante, em português simples, com passos numerados e um exercício prático.");setChatAnswer("")}}>Estudar aula →</button></div></article>)}</div>
      </section>

      <section id="aulas">
        <div className="section-head"><div><h2>Aulas para começar agora</h2><div className="muted" style={{marginTop:7}}>Pequenas lições para construir uma base forte.</div></div></div>
        <div className="two-col">
          <div className="card"><div className="lesson-list">{lessons.map(l=><div className="lesson" key={l.title}><div><strong>{l.title}</strong><div className="muted" style={{fontSize:13,marginTop:5}}>{l.subject} · {l.time}</div></div><button className="btn secondary" onClick={()=>setCompleted(old=>old.includes(l.title)?old:[...old,l.title])}>{completed.includes(l.title)?"✓ Feita":"Concluir"}</button></div>)}</div><div className="progress"><span style={{width:`${Math.min(100,completed.length/lessons.length*100)}%`}}/></div><span className="muted" style={{fontSize:13}}>{completed.length} de {lessons.length} atividades marcadas como concluídas nesta visita.</span></div>
          <div className="card" id="professor" style={{background:"#10233f",color:"white",border:0}}><div className="subject-icon" style={{background:"#f6c453"}}>🤖</div><div className="eyebrow">Professor virtual</div><h2 style={{fontSize:25}}>Não entendeu? Pergunte.</h2><p style={{color:"#d6e1ef"}}>Peça uma explicação mais simples, um exemplo ou exercícios extras. O professor pode ajudar no estudo, mas confira informações importantes com seus materiais e professores.</p><button className="btn" onClick={()=>{setModal("ai");setChatAnswer("")}}>Conversar com o professor IA →</button></div>
        </div>
      </section>

      <section style={{marginTop:28}}><div className="card"><div className="section-head" style={{marginTop:0}}><div><h2>Teste rápido de matemática</h2><div className="muted" style={{marginTop:6}}>Pratique e veja a explicação da resposta.</div></div><span className="pill">Exemplo</span></div><p><strong>Quanto é 25% de 80?</strong></p><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["10","15","20","25"].map(v=><button key={v} className="btn secondary" onClick={()=>setAnswer(v)} style={{background:answer===v?"#fff0c2":"white"}}>{v}</button>)}</div>{answer&&<div className="feedback" style={{background:quizCorrect?"#eaf8ef":"#fff1e9",color:quizCorrect?"#17613c":"#9a421c"}}>{quizCorrect?"Muito bem! 25% é um quarto. 80 ÷ 4 = 20.":"Ainda não. 25% significa um quarto. Divida 80 por 4: o resultado é 20."}</div>}</div></section>
      <footer className="footer"><div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}><span>© 2026 MW Aprende · Educação para todos.</span><span>Estude com curiosidade. Evolua com constância.</span></div><p>Conteúdos educacionais. Certificados, quando disponíveis, não substituem diplomas oficiais.</p></footer>
    </div>

    {modal&&<div className="modal-backdrop" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:"0 0 8px"}}>{modal==="signup"?"Criar conta gratuita":modal==="login"?"Entrar no MW Aprende":modal==="ai"?"Professor virtual MW":"Praticar e aprender"}</h2><button className="btn secondary" onClick={()=>setModal(null)}>Fechar</button></div>
      {(modal==="signup"||modal==="login")&&<><p className="muted">Seu progresso poderá ser salvo na sua conta depois que o banco de dados estiver configurado.</p>{modal==="signup"&&<div className="field"><label>Seu nome</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos te chamar?"/></div>}<div className="field"><label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div><div className="field"><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres"/></div>{modal==="signup"&&<div className="field"><label>Seu objetivo</label><select value={level} onChange={e=>setLevel(e.target.value)}><option>Quero aprender desde o básico</option><option>Reforço escolar</option><option>Ensino fundamental</option><option>Ensino médio</option><option>ENEM e vestibular</option><option>Concursos públicos</option><option>Aprender para a vida e o trabalho</option></select></div>}<button className="btn dark" disabled={busy||!email||!password} onClick={()=>auth(modal)}>{busy?"Aguarde...":modal==="signup"?"Criar minha conta":"Entrar"}</button><p><button style={{border:0,background:"none",color:"#2456a6",cursor:"pointer"}} onClick={()=>{setModal(modal==="signup"?"login":"signup");setMessage("")}}>{modal==="signup"?"Já tenho conta":"Quero criar uma conta"}</button></p>{message&&<div className="feedback">{message}</div>}</>}
      {modal==="quiz"&&<><p>Vamos aprender com exemplos simples. Pergunta: <strong>{question}</strong></p><p className="muted">Esta área demonstra a prática interativa. O catálogo completo de aulas deve ser ampliado com conteúdo revisado.</p><button className="btn dark" onClick={()=>{setQuestion("Quanto é 25% de 80?");setModal("quiz")}}>Abrir exercício de matemática</button></>}
      {modal==="ai"&&<><p className="muted">Escreva sua dúvida. Para obter respostas reais da IA, configure GEMINI_API_KEY no servidor.</p><div className="field"><label>Sua pergunta</label><textarea rows={4} value={chatQuestion} onChange={e=>setChatQuestion(e.target.value)} placeholder="Ex.: Explique frações como se eu estivesse começando agora."/></div><button className="btn dark" disabled={busy||!chatQuestion.trim()} onClick={askTeacher}>{busy?"Pensando...":"Perguntar ao professor"}</button>{chatAnswer&&<div className="feedback" style={{whiteSpace:"pre-wrap"}}>{chatAnswer}</div>}</>}
    </div></div>}
  </main>;
}
