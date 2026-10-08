/* Story / Campaign layer — The Frozen Passage
 * D&D 5e 2014 campaign state only. Combat remains engine-authoritative.
 */
(function(){
  "use strict";

  const STORY_VERSION = 1;
  const DEFAULT_STORY = {
    version: STORY_VERSION,
    campaignId: "the-frozen-passage",
    chapterId: "chapter-1",
    chapterTitle: "The Frozen Passage",
    act: "Act I — Gerbang Membeku",
    status: "active",
    mainQuest: {
      id: "main-frozen-passage",
      title: "The Frozen Passage",
      status: "active",
      objective: "Selidiki Gerbang Membeku dan cari tahu mengapa jalur ini terasa seperti menunggu kedatangan kalian."
    },
    currentObjective: "Selidiki Gerbang Membeku.",
    clues: [],
    milestones: [],
    storyFlags: {},
    completedChapters: []
  };

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function ensureStory(){
    if(!window.adventureState) return null;
    const current = adventureState.story && typeof adventureState.story === "object"
      ? adventureState.story
      : {};
    adventureState.story = {
      ...clone(DEFAULT_STORY),
      ...current,
      mainQuest: {
        ...clone(DEFAULT_STORY.mainQuest),
        ...(current.mainQuest || {})
      },
      clues: Array.isArray(current.clues) ? current.clues : [],
      milestones: Array.isArray(current.milestones) ? current.milestones : [],
      storyFlags: current.storyFlags && typeof current.storyFlags === "object" ? current.storyFlags : {},
      completedChapters: Array.isArray(current.completedChapters) ? current.completedChapters : []
    };
    return adventureState.story;
  }

  function renderStory(){
    const host=document.querySelector("#storyCampaignPanel");
    if(!host) return;
    const s=ensureStory();
    if(!s) return;

    const quest=s.mainQuest||{};
    const flags=Object.entries(s.storyFlags||{});
    const clues=s.clues||[];
    const milestones=s.milestones||[];

    host.innerHTML="";
    const card=document.createElement("div");
    card.className="card story-campaign-card";
    card.innerHTML=
      '<div class="story-kicker">STORY / CAMPAIGN</div>'+
      '<div class="story-title">'+escapeHtml(s.chapterTitle||"The Frozen Passage")+'</div>'+
      '<div class="story-act">'+escapeHtml(s.act||"Act I")+'</div>'+
      '<div class="story-section"><span>Main Quest</span><b>'+escapeHtml(quest.title||"The Frozen Passage")+'</b></div>'+
      '<div class="story-objective">'+escapeHtml(s.currentObjective||quest.objective||"Belum ada objective.")+'</div>'+
      '<div class="story-meta">'+
        '<span>Status: '+escapeHtml(s.status||"active")+'</span>'+
        '<span>Milestone: '+milestones.length+'</span>'+
        '<span>Clue: '+clues.length+'</span>'+
      '</div>'+
      (clues.length
        ? '<div class="story-list"><div class="story-label">Clue yang ditemukan</div>'+clues.slice(-5).map(c=>'<div>• '+escapeHtml(typeof c==="string"?c:c.text||c.title||"Clue")+'</div>').join("")+'</div>'
        : '')+
      (flags.length
        ? '<div class="story-list"><div class="story-label">Story Flags</div>'+flags.slice(-6).map(([k,v])=>'<div>• '+escapeHtml(k)+': <b>'+escapeHtml(String(v))+'</b></div>').join("")+'</div>'
        : '')+
      '<div class="story-hint">Story state mengikuti perjalanan campaign. Combat tetap ditangani engine.</div>';
    host.appendChild(card);
  }

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  }

  function injectPanel(){
    if(document.querySelector("#storyCampaignPanel")) return;
    const party=document.querySelector("#adventureParty");
    if(!party) return;
    const panel=document.createElement("div");
    panel.id="storyCampaignPanel";
    panel.innerHTML="";
    party.parentElement?.insertBefore(panel,party.parentElement.firstChild);
    renderStory();
  }

  function injectStyles(){
    if(document.querySelector("#storyCampaignStyles")) return;
    const style=document.createElement("style");
    style.id="storyCampaignStyles";
    style.textContent=
      ".story-campaign-card{border-color:#2a6783;background:linear-gradient(145deg,#061722,#0a202d)}"+
      ".story-kicker{font-size:10px;letter-spacing:.16em;color:#69c7ff;text-transform:uppercase}"+
      ".story-title{font:700 22px/1.05 Georgia,serif;margin-top:5px;color:#f0fbff}"+
      ".story-act{font-size:11px;color:#91a9b8;margin-top:4px}"+
      ".story-section{display:flex;justify-content:space-between;gap:10px;margin-top:12px;font-size:11px;color:#91a9b8}"+
      ".story-section b{color:#fff;text-align:right}"+
      ".story-objective{margin-top:8px;padding:10px;border:1px solid #17465d;border-radius:11px;background:#06131d;font:14px/1.35 Georgia,serif;color:#e8f4f8}"+
      ".story-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px;font-size:9px;color:#a9c4d2}"+
      ".story-meta span{border:1px solid #214b60;border-radius:99px;padding:4px 7px}"+
      ".story-list{margin-top:9px;padding-top:8px;border-top:1px solid #123746;font-size:11px;line-height:1.5;color:#c6d9e2}"+
      ".story-label{font-size:9px;color:#69c7ff;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px}"+
      ".story-hint{margin-top:9px;font-size:9px;color:#718b98}";
    document.head.appendChild(style);
  }

  function init(){
    if(!window.adventureState) return;
    ensureStory();
    if(typeof window.saveAdventureState==="function") window.saveAdventureState();
    injectStyles();
    injectPanel();

    const oldRender=window.renderAdventure;
    if(typeof oldRender==="function" && !oldRender.__storyWrapped){
      const wrapped=function(){
        oldRender.apply(this,arguments);
        ensureStory();
        injectPanel();
        renderStory();
      };
      wrapped.__storyWrapped=true;
      window.renderAdventure=wrapped;
    }
    renderStory();
  }

  window.ensureStoryCampaignState=ensureStory;
  window.renderStoryCampaign=renderStory;

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
