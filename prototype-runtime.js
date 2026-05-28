(() => {

// ══════════════════════════════════════════════════════════════
// SETUP LOGIC
// ══════════════════════════════════════════════════════════════
let selectedDiff='easy', selectedMode='new', selectedPickerTask=null;

function selectDiff(d){selectedDiff=d;['easy','medium','hard'].forEach(x=>document.getElementById('diff-'+x).classList.remove('active'));document.getElementById('diff-'+d).classList.add('active');}
function selectMode(m){selectedMode=m;['new','existing'].forEach(x=>document.getElementById('mode-'+x).classList.remove('active'));document.getElementById('mode-'+m).classList.add('active');if(m==='existing')openPicker();}
function startStudy(){document.getElementById('setupPage').style.display='none';document.getElementById('appPage').style.display='block';loadTask(selectedPickerTask||1);}
function goSetup(){document.getElementById('appPage').style.display='none';document.getElementById('setupPage').style.display='flex';}

const pickerQuestions=[
  {id:1,title:'A 2-year-old boy with seal-bark cough and stridor',domain:'Paediatrics',date:'2026-01-12',vignette:'A 2-year-old boy is brought to the emergency department with sudden onset noisy breathing overnight after two days of runny nose and low-grade fever.',stem:'What is the most likely diagnosis?'},
  {id:2,title:'A 14-month-old boy with poor weight gain and greasy stools',domain:'Paediatrics',date:'2026-01-18',vignette:'A 14-month-old boy with poor weight gain, persistent wet cough, three episodes of pneumonia, and bulky pale greasy stools.',stem:'What is the most likely diagnosis?'},
  {id:3,title:'A 7-year-old boy with lifelong wet cough and ear infections',domain:'Paediatrics',date:'2026-02-04',vignette:'A 7-year-old boy with a wet, mucus-like cough since infancy, neonatal respiratory distress, and recurrent ear infections requiring ear tubes. Growth is normal.',stem:'What is the most likely diagnosis?'},
];

function openPicker(){renderPicker(pickerQuestions);document.getElementById('pickerModal').classList.add('open');}
function closePicker(){document.getElementById('pickerModal').classList.remove('open');if(!selectedPickerTask){selectedMode='new';document.getElementById('mode-new').classList.add('active');document.getElementById('mode-existing').classList.remove('active');}}
function renderPicker(qs){document.getElementById('pickerList').innerHTML=qs.map(q=>`<div class="picker-card ${selectedPickerTask===q.id?'selected':''}" onclick="selectPicker(${q.id})"><div class="picker-card-title">${q.title}</div><div class="picker-card-meta"><span>${q.domain}</span><span>${q.date}</span></div>${selectedPickerTask===q.id?`<div class="picker-card-preview">${q.vignette}</div>`:''}</div>`).join('');}
function selectPicker(id){selectedPickerTask=id;const btn=document.getElementById('pickerConfirmBtn');btn.disabled=false;btn.style.opacity='1';renderPicker(pickerQuestions);}
function filterPicker(val){renderPicker(pickerQuestions.filter(p=>p.title.toLowerCase().includes(val.toLowerCase())||p.vignette.toLowerCase().includes(val.toLowerCase())));}
function confirmPicker(){closePicker();}

// ══════════════════════════════════════════════════════════════
// TASK DATA
// ══════════════════════════════════════════════════════════════
const tasks={
1:{
  title:'Task 1 — Textual explanation only',chip:'Explanation: Text only',
  condition:'Primary ciliary dyskinesia · Chronic wet cough · text explanation only',mode:'text',
  difficulty:'Easy',target:'Primary ciliary dyskinesia',source:"Nelson's Essentials · Chronic Wet Cough",correct:'C',
  question_stem:'What is the most likely diagnosis?',
  vignette:'A 7-year-old boy is brought to clinic for a persistent cough. His parents report that he has had a wet, mucus-like cough for as long as they can remember, often worsening in the mornings. He was born at term but experienced respiratory distress shortly after birth, requiring a brief stay in the NICU. Throughout early childhood, he had recurrent ear infections necessitating multiple sets of ear tubes. On examination, his growth parameters are at the 50th percentile. Auscultation reveals mild hyperinflation and coarse crackles over both lung fields. He has no history of fatty stools.',
  options:{A:'Cystic fibrosis',B:'Humoral immunodeficiency',C:'Primary ciliary dyskinesia',D:'Gastroesophageal reflux',E:'Asthma'},
  supporting:[
    {phrase:'wet, mucus-like cough for as long as they can remember',why:'A lifelong wet cough from birth indicates a fundamental defect in airway clearance — the hallmark of a primary mucociliary disorder.'},
    {phrase:'respiratory distress shortly after birth, requiring a brief stay in the NICU',why:'Neonatal respiratory distress in a term infant is a characteristic early presentation of PCD; cilia are responsible for clearing lung fluid after delivery.'},
    {phrase:'recurrent ear infections necessitating multiple sets of ear tubes',why:'Recurrent otitis media requiring tympanostomy tubes reflects ciliary dysfunction in the Eustachian tube — a distinctive PCD pattern.'},
    {phrase:'growth parameters are at the 50th percentile',why:'Normal growth contrasts with cystic fibrosis, where pancreatic insufficiency causes failure to thrive. PCD does not affect exocrine function.'},
    {phrase:'no history of fatty stools',why:'Absence of steatorrhoea confirms normal pancreatic exocrine function, effectively excluding cystic fibrosis.'},
  ],
  distractors:[
    {letter:'A',disease:'Cystic fibrosis',plausible:'CF causes chronic wet cough, recurrent pneumonia, and can present in early childhood.',incorrect:'CF typically presents with failure to thrive and steatorrhoea. This child has normal growth and no fatty stools. Neonatal respiratory distress followed by recurrent otitis media is the PCD pattern.'},
    {letter:'B',disease:'Humoral immunodeficiency',plausible:'Causes recurrent infections including otitis media and respiratory infections.',incorrect:'Does not explain neonatal respiratory distress in a term infant, nor the lifelong wet cough suggestive of a structural clearance defect.'},
    {letter:'D',disease:'Gastroesophageal reflux',plausible:'Can cause chronic cough in children through laryngeal irritation or aspiration.',incorrect:'GERD does not explain neonatal respiratory distress or recurrent otitis media requiring ear tubes.'},
    {letter:'E',disease:'Asthma',plausible:'Common cause of chronic cough and hyperinflation in childhood.',incorrect:'Asthma does not account for neonatal respiratory distress, recurrent otitis media requiring tubes, or a consistently productive wet cough since birth.'},
  ],
  kgData:{
    evidence:[
      {id:'ev1',label:'Chronic productive cough\nsince infancy',short:'Chronic productive cough',phrase:'wet, mucus-like cough for as long as they can remember'},
      {id:'ev2',label:'Term neonatal\nrespiratory distress',short:'Neonatal respiratory distress',phrase:'respiratory distress shortly after birth, requiring a brief stay in the NICU'},
      {id:'ev3',label:'Recurrent otitis media',short:'Recurrent otitis media',phrase:'recurrent ear infections necessitating multiple sets of ear tubes'},
      {id:'ev4',label:'Normal growth\ntrajectory',short:'Normal growth trajectory',phrase:'growth parameters are at the 50th percentile'},
      {id:'ev5',label:'Absence of\nsteatorrhea',short:'Absence of steatorrhea',phrase:'no history of fatty stools'},
    ],
    findings:[
      {id:'cf1',label:'Impaired mucociliary\nclearance',nodeType:'mechanism',from:['ev1','ev2'],
        tooltip:'Lifelong wet cough since birth combined with neonatal respiratory distress both indicate a structural defect in mucociliary clearance — the mechanism by which cilia sweep mucus out of airways. Together they map to this clinical finding.'},
      {id:'cf2',label:'Eustachian tube\nmucociliary dysfunction',nodeType:'mechanism',from:['ev3'],
        tooltip:'Recurrent otitis media requiring tympanostomy tubes reflects impaired cilia function in the Eustachian tube, which normally clears the middle ear. This is a distinctive anatomical signature of PCD.'},
      {id:'cf3',label:'Preserved pancreatic\nexocrine function',nodeType:'mechanism',from:['ev4','ev5'],
        tooltip:'Normal growth at the 50th percentile and the absence of fatty stools together confirm that pancreatic exocrine function is intact. This combination actively excludes cystic fibrosis, which causes malabsorption.'},
    ],
    mechs:[
      {id:'m1',label:'Axonemal dynein arm\ndysfunction',nodeType:'mechanism',from:['cf1','cf2'],
        tooltip:'Both the airway mucociliary failure and the Eustachian tube dysfunction are explained by a single underlying mechanism: a structural defect in the dynein arms of cilia that drive coordinated ciliary beating across all epithelial surfaces.'},
    ],
    dx:{id:'dx',label:'Primary ciliary\ndyskinesia',nodeType:'diagnosis',from:['m1','cf3'],
      tooltip:'PCD is confirmed by the convergence of global dynein arm ciliary dysfunction (causing mucociliary and Eustachian tube failure) with intact pancreatic function that excludes CF. This is an autosomal recessive disorder.'},
    excludeCards:[
      {cue:'Normal growth + no steatorrhoea',target:'Cystic fibrosis',focus:['ev4','ev5'],
        explanation:'CF causes pancreatic insufficiency → malabsorption → failure to thrive + fatty stools. Normal growth at 50th percentile and absence of fatty stools together rule this out — a child with CF eating normally would still fail to thrive.'},
      {cue:'Neonatal RD + recurrent OM — structural clearance defect',target:'Asthma / Humoral ID',focus:['ev2','ev3'],
        explanation:'Asthma does not cause neonatal respiratory distress or recurrent otitis media. Humoral immunodeficiency leads to recurrent infections but not through a structural clearance defect — neonatal RD is absent. Only PCD explains all three.'},
    ]
  }
},
2:{
  title:'Task 2 — Knowledge graph explanation only',chip:'Explanation: KG only',
  condition:'Cystic fibrosis · Chronic wet cough · KG explanation only',mode:'kg',
  difficulty:'Easy',target:'Cystic fibrosis',source:"Nelson's Essentials · Chronic Wet Cough",correct:'B',
  question_stem:'What is the most likely diagnosis?',
  vignette:'A 14-month-old boy is brought to the clinic by his parents due to poor weight gain and a persistent cough. Despite eating well, his weight has remained stagnant for the past four months. He has had three episodes of pneumonia requiring antibiotics since infancy and frequently has a wet-sounding cough. His parents describe his stools as bulky, pale, and unusually greasy. On examination, he appears thin. Mild digital clubbing is noted, and auscultation reveals diffuse crackles.',
  options:{A:'Primary ciliary dyskinesia',B:'Cystic fibrosis',C:'Humoral immunodeficiency',D:'Gastroesophageal reflux with aspiration',E:'Asthma'},
  supporting:[
    {phrase:'poor weight gain',why:'Failure to thrive despite adequate oral intake indicates malabsorption — a hallmark of cystic fibrosis pancreatic insufficiency.'},
    {phrase:'bulky, pale, and unusually greasy',why:'Steatorrhoea directly reflects exocrine pancreatic insufficiency, which occurs in ~85% of CF patients.'},
    {phrase:'three episodes of pneumonia requiring antibiotics since infancy',why:'Recurrent lower respiratory tract infections reflect impaired mucociliary clearance due to viscous mucus in the CF airways.'},
    {phrase:'wet-sounding cough',why:'Chronic productive cough indicates ongoing airway secretion retention — a key feature of CF lung disease.'},
    {phrase:'Mild digital clubbing',why:'Digital clubbing is a sign of chronic hypoxaemia and lung disease, common in established CF.'},
  ],
  distractors:[
    {letter:'A',disease:'Primary ciliary dyskinesia',plausible:'PCD causes chronic wet cough and recurrent pneumonia via impaired mucociliary clearance.',incorrect:'PCD does not affect the pancreas; it does not cause steatorrhoea or failure to thrive. The greasy stools and poor weight gain with normal intake specifically point away from PCD.'},
    {letter:'C',disease:'Humoral immunodeficiency',plausible:'Can cause recurrent sinopulmonary infections in childhood.',incorrect:'Does not explain steatorrhoea, failure to thrive, or digital clubbing.'},
    {letter:'D',disease:'GERD with aspiration',plausible:'Chronic aspiration can cause recurrent cough and pneumonia in infants.',incorrect:'GERD does not cause steatorrhoea or digital clubbing. Weight issues in GERD relate to feeding avoidance, not malabsorption.'},
    {letter:'E',disease:'Asthma',plausible:'Chronic cough and recurrent respiratory symptoms are common in paediatric asthma.',incorrect:'Asthma does not produce steatorrhoea, failure to thrive, recurrent bacterial pneumonia, or digital clubbing.'},
  ],
  kgData:{
    evidence:[
      {id:'ev1',label:'Failure to thrive',short:'Failure to thrive',phrase:'poor weight gain'},
      {id:'ev2',label:'Steatorrhea',short:'Steatorrhea',phrase:'bulky, pale, and unusually greasy'},
      {id:'ev3',label:'Recurrent lower\nrespiratory infections',short:'Recurrent LRTIs',phrase:'three episodes of pneumonia requiring antibiotics since infancy',hiddenInMain:true},
      {id:'ev4',label:'Chronic productive\ncough',short:'Chronic productive cough',phrase:'wet-sounding cough',hiddenInMain:true},
      {id:'ev5',label:'Mild digital clubbing',short:'Digital clubbing',phrase:'Mild digital clubbing',hiddenInMain:true},
    ],
    findings:[
      {id:'cf1',label:'Failure to thrive',nodeType:'sign',from:['ev1'],
        tooltip:'Poor weight gain despite eating well maps to the KG concept "Failure to thrive".'},
      {id:'cf2',label:'Steatorrhea',nodeType:'symptom',from:['ev2'],
        tooltip:'Bulky pale greasy stools map to steatorrhea, a standard concept for fat malabsorption.'},
      {id:'cf3',label:'Recurrent lower\nrespiratory infections',nodeType:'history',from:['ev3'],
        mergedEvidence:'ev3',
        tooltip:'Repeated pneumonia requiring antibiotics maps to recurrent lower respiratory infection.'},
      {id:'cf4',label:'Chronic productive\ncough',nodeType:'symptom',from:['ev4'],
        mergedEvidence:'ev4',
        tooltip:'Wet-sounding cough maps to productive cough, indicating retained airway secretions.'},
      {id:'cf5',label:'Digital clubbing',nodeType:'sign',from:['ev5'],
        mergedEvidence:'ev5',
        tooltip:'Mild digital clubbing maps directly to the clinical sign digital clubbing.'},
    ],
    mechs:[
      {id:'m1',label:'Exocrine pancreatic\ninsufficiency',nodeType:'mechanism',from:['cf1','cf2'],
        tooltip:'CFTR dysfunction disrupts bicarbonate and enzyme secretion by pancreatic acinar cells, causing fat and protein malabsorption. This is the mechanism behind both the steatorrhoea and the failure to thrive seen in CF.'},
      {id:'m2',label:'Impaired mucociliary\nclearance',nodeType:'mechanism',from:['cf3','cf4'],
        tooltip:'CFTR dysfunction dehydrates airway surface liquid, producing abnormally thick viscous mucus. Cilia cannot clear this mucus, leading to chronic bacterial colonisation, suppurative airway disease, and progressive lung damage.'},
      {id:'m3',label:'Chronic lung disease',nodeType:'disorder',from:['cf5'],
        tooltip:'Digital clubbing is associated with chronic lung disease and chronic hypoxaemia.'},
    ],
    dx:{id:'dx',label:'Cystic fibrosis',nodeType:'diagnosis',from:['m1','m2','m3'],
      tooltip:'CF is the only diagnosis that simultaneously explains pancreatic insufficiency, impaired mucociliary clearance, and early-onset chronic lung disease in a young child. CFTR mutations disrupt epithelial ion transport across multiple organ systems.'},
    excludeCards:[
      {cue:'Recurrent pneumonia + wet cough',target:'Primary ciliary dyskinesia',supports:['ev3','ev4'],against:['ev2','ev1'],
        expected:'Neonatal RD\nrecurrent otitis media',
        expectedExplanation:'PCD often has neonatal respiratory distress and recurrent otitis media. These expected PCD clues are not established in the vignette.',
        explanation:'PCD is plausible because recurrent pneumonia and chronic wet cough can result from impaired mucociliary clearance. It is ruled out by the separate gastrointestinal malabsorption pattern, which PCD does not cause.'},
      {cue:'Greasy stools + poor weight gain',target:'Humoral immunodeficiency',supports:['ev3'],against:['ev2','ev1','ev5'],
        expected:'Low immunoglobulins\npoor vaccine response',
        expectedExplanation:'Humoral immunodeficiency would be supported by antibody-defect clues such as low immunoglobulins or poor vaccine response. These are not established in the vignette.',
        explanation:'Humoral immunodeficiency can cause recurrent sinopulmonary infection, but it does not explain steatorrhoea or failure to thrive despite eating well. Those GI clues point to pancreatic insufficiency rather than antibody failure.'},
      {cue:'Recurrent pneumonia + greasy stools',target:'GERD with aspiration',supports:['ev3'],against:['ev2'],
        expected:'Reflux / choking\nwith feeds',
        expectedExplanation:'GERD with aspiration would be supported by reflux, choking, or cough during feeds. These expected clues are not established in the vignette.',
        explanation:'GERD with aspiration may explain recurrent respiratory symptoms, but it does not cause bulky greasy stools. The presence of steatorrhoea shifts the explanation toward cystic fibrosis with pancreatic insufficiency.'},
      {cue:'Digital clubbing + recurrent pneumonia',target:'Asthma',supports:['ev4'],against:['ev5','ev3','ev2'],
        expected:'Episodic wheeze\ntrigger history',
        expectedExplanation:'Asthma would be supported by episodic wheeze or a trigger history. These expected asthma clues are not established in the vignette.',
        explanation:'Asthma can cause cough and wheeze, but digital clubbing and recurrent bacterial pneumonia indicate chronic suppurative lung disease. Those findings are not typical for uncomplicated asthma.'},
    ]
  }
},
3:{
  title:'Task 3 — Bad question regeneration',chip:'Explanation: hidden until requested',
  condition:'Croup · intentionally flawed item · regeneration task',mode:'both',regenerated:false,
  difficulty:'Easy',target:'Croup',source:"Nelson's Essentials · Acute Stridor",correct:'C',
  question_stem:'What is the most likely diagnosis?',
  vignette:'A 2-year-old boy is brought to the emergency department because of noisy breathing that started overnight. For the past two days, he has had a runny nose and a low-grade fever. His parents say his cough sounds exactly like a “seal bark,” and the clinician notes that this is a classic croup-like cough. On examination, he is alert, playful, and sitting comfortably in his mother’s lap. He has inspiratory stridor and a hoarse voice. He is not drooling, has no difficulty swallowing, and can drink water normally. His parents ask whether this could be croup.',
  options:{A:'Epiglottitis',B:'Bacterial tracheitis',C:'Croup',D:'Foreign body aspiration',E:'Retropharyngeal abscess'},
  supporting:[
    {phrase:'2-year-old boy',why:'Toddler age is compatible with croup, but in this flawed version it is only one of many redundant cues.'},
    {phrase:'runny nose and a low-grade fever',why:'A viral prodrome supports croup, but the vignette already contains several more direct clues.'},
    {phrase:'sounds exactly like a “seal bark,”',why:'A barky cough is a classic croup clue. The wording makes the answer highly recognizable.'},
    {phrase:'classic croup-like cough',why:'This phrase almost names the correct diagnosis and is the main reason the item is intentionally flawed.'},
    {phrase:'not drooling, has no difficulty swallowing, and can drink water normally',why:'These findings explicitly eliminate epiglottitis, making the distractor too easy to reject.'},
    {phrase:'whether this could be croup',why:'The vignette directly asks about the correct answer, which gives away the diagnosis.'},
  ],
  distractors:[
    {letter:'A',disease:'Epiglottitis',plausible:'Can cause fever and acute stridor in children.',incorrect:'The vignette explicitly states normal swallowing and no drooling, which makes epiglottitis too easy to eliminate.'},
    {letter:'B',disease:'Bacterial tracheitis',plausible:'Can cause stridor and fever after a viral illness.',incorrect:'The child is playful and non-toxic with low-grade fever, whereas bacterial tracheitis usually causes a much sicker appearance.'},
    {letter:'D',disease:'Foreign body aspiration',plausible:'Can cause sudden noisy breathing in a toddler.',incorrect:'The two-day viral prodrome and barky cough make infection much more likely than an aspiration event.'},
    {letter:'E',disease:'Retropharyngeal abscess',plausible:'Can cause fever and upper-airway symptoms.',incorrect:'Normal swallowing, no drooling, and a barky cough argue against a deep neck infection.'},
  ],
  kgData:{
    evidence:[
      {id:'ev_age',label:'Toddler age\n(2 years)',short:'Toddler age',phrase:'2-year-old boy'},
      {id:'ev_uri',label:'Viral upper respiratory\nprodrome',short:'Viral URI prodrome',phrase:'runny nose and a low-grade fever'},
      {id:'ev_bark',label:'Barking cough',short:'Barking cough',phrase:'sounds exactly like a “seal bark,”'},
      {id:'ev_named',label:'Diagnosis-cue\nwording',short:'Diagnosis cue wording',phrase:'classic croup-like cough'},
      {id:'ev_stridor',label:'Inspiratory stridor\nand hoarseness',short:'Inspiratory stridor + hoarseness',phrase:'inspiratory stridor and a hoarse voice'},
      {id:'ev_well',label:'Non-toxic appearance',short:'Non-toxic appearance',phrase:'alert, playful, and sitting comfortably'},
      {id:'ev_swallow',label:'Absence of drooling\nor dysphagia',short:'Absence of drooling/dysphagia',phrase:'not drooling, has no difficulty swallowing, and can drink water normally'},
      {id:'ev_parent',label:'Direct diagnosis\ncue',short:'Direct diagnosis cue',phrase:'whether this could be croup'},
    ],
    findings:[
      {id:'cf_age',label:'Peak age for\ncroup',nodeType:'demographic',from:['ev_age'],tooltip:'Croup is common in toddlers, so age supports the diagnosis.'},
      {id:'cf_viral',label:'Viral upper respiratory\nprodrome',nodeType:'history',from:['ev_uri'],tooltip:'A short viral prodrome with mild fever is typical before croup symptoms.'},
      {id:'cf_bark',label:'Barking cough',nodeType:'symptom',from:['ev_bark'],tooltip:'Barky cough is a highly recognizable croup cue.'},
      {id:'cf_upper',label:'Inspiratory upper-airway\nobstruction',nodeType:'sign',from:['ev_stridor'],tooltip:'Inspiratory stridor and hoarse voice localize the problem to the upper airway.'},
      {id:'cf_exclude',label:'Absence of epiglottitis\nred flags',nodeType:'sign',from:['ev_well','ev_swallow'],tooltip:'The vignette explicitly removes red flags for epiglottitis and severe bacterial infection.'},
    ],
    mechs:[
      {id:'m_croup',label:'Subglottic edema',nodeType:'mechanism',from:['cf_viral','cf_upper'],tooltip:'Viral inflammation causes subglottic edema, producing stridor, hoarseness, and barky cough.'},
    ],
    dx:{id:'dx',label:'Croup',nodeType:'diagnosis',from:['cf_age','cf_bark','m_croup'],tooltip:'The diagnosis is croup, but the original version makes the answer too obvious.'},
    excludeCards:[
      {target:'Epiglottitis',supports:['ev_stridor'],against:['ev_swallow','ev_well'],expected:'Drooling / dysphagia\ntoxic child',expectedExplanation:'Epiglottitis would usually show drooling, dysphagia, high fever, and toxic appearance.',explanation:'This distractor is too easy to eliminate because the vignette explicitly states no drooling and normal swallowing.'},
      {target:'Bacterial tracheitis',supports:['ev_uri','ev_stridor'],against:['ev_well','ev_uri'],expected:'High fever\ntoxic appearance',expectedExplanation:'Bacterial tracheitis is expected to cause a much sicker, toxic child with high fever and purulent secretions.',explanation:'The child is comfortable and has only mild fever, so the distractor is weak in this version.'},
      {target:'Foreign body aspiration',supports:['ev_stridor'],against:['ev_uri','ev_bark'],expected:'Choking episode\nabrupt onset',expectedExplanation:'Foreign body aspiration would usually involve a choking episode without viral prodrome.',explanation:'The viral prodrome and barky cough point away from foreign body aspiration.'},
      {target:'Retropharyngeal abscess',supports:['ev_uri'],against:['ev_swallow','ev_bark'],expected:'Dysphagia\nneck stiffness\nmuffled voice',expectedExplanation:'Retropharyngeal abscess would be expected to cause dysphagia, neck stiffness/torticollis, and muffled voice.',explanation:'Normal swallowing and barky cough make retropharyngeal abscess easy to reject.'},
    ]
  },
},
};

const task3ImprovedTemplate={
  title:'Task 3 — Regenerated question review',chip:'Regenerated version · explanation hidden',
  condition:'Croup · regenerated item · expert-selected support mode',mode:'both',regenerated:true,
  difficulty:'Easy',target:'Croup',source:"Nelson's Essentials · Acute Stridor",correct:'C',
  question_stem:'What is the most likely diagnosis?',
  vignette:'A 2-year-old boy is brought to the emergency department because of noisy breathing that worsened overnight. He has had two days of nasal congestion and a mild fever. His parents report that his cough became harsher during the night. On examination, he is alert and sitting upright in his mother’s lap. His temperature is 38.1°C. He has inspiratory stridor at rest, a hoarse voice, and mild subcostal retractions. He is able to swallow and has no drooling. Lung auscultation is otherwise clear.',
  options:{A:'Epiglottitis',B:'Bacterial tracheitis',C:'Croup',D:'Foreign body aspiration',E:'Retropharyngeal abscess'},
  supporting:[
    {phrase:'2-year-old boy',why:'Croup is most common in toddlers, whose subglottic airway is narrow.'},
    {phrase:'two days of nasal congestion and a mild fever',why:'A short viral prodrome supports viral laryngotracheobronchitis.'},
    {phrase:'inspiratory stridor at rest, a hoarse voice',why:'Stridor and hoarseness indicate upper-airway narrowing around the laryngeal/subglottic region.'},
    {phrase:'able to swallow and has no drooling',why:'Normal swallowing and no drooling argue against epiglottitis.'},
  ],
  distractors:[
    {letter:'A',disease:'Epiglottitis',plausible:'Fever and stridor can occur in epiglottitis.',incorrect:'Epiglottitis usually causes toxic appearance, drooling, dysphagia, and high fever; this child can swallow and is not drooling.'},
    {letter:'B',disease:'Bacterial tracheitis',plausible:'Can follow viral URI and cause fever with stridor.',incorrect:'Bacterial tracheitis usually causes high fever, toxic appearance, and severe illness, which are not present.'},
    {letter:'D',disease:'Foreign body aspiration',plausible:'Can cause acute noisy breathing or stridor in toddlers.',incorrect:'A two-day viral prodrome and fever make croup more likely; no choking episode is described.'},
    {letter:'E',disease:'Retropharyngeal abscess',plausible:'Can cause fever and upper-airway symptoms.',incorrect:'Expected findings include dysphagia, neck stiffness/torticollis, and muffled voice; these are absent.'},
  ],
  kgData:{
    evidence:[
      {id:'ev_age',label:'Toddler age\n(2 years)',short:'Toddler age',phrase:'2-year-old boy'},
      {id:'ev_uri',label:'Viral upper respiratory\nprodrome',short:'Viral URI prodrome',phrase:'two days of nasal congestion and a mild fever'},
      {id:'ev_stridor_voice',label:'Inspiratory stridor\nand hoarseness',short:'Inspiratory stridor + hoarseness',phrase:'inspiratory stridor at rest, a hoarse voice'},
      {id:'ev_swallow',label:'Absence of drooling\nor dysphagia',short:'Absence of drooling/dysphagia',phrase:'able to swallow and has no drooling'},
    ],
    findings:[
      {id:'cf_age',label:'Peak age for\ncroup',nodeType:'demographic',from:['ev_age'],tooltip:'Toddler age supports croup because the subglottic airway is narrow in this age range.'},
      {id:'cf_viral',label:'Viral upper respiratory\nprodrome',nodeType:'history',from:['ev_uri'],tooltip:'Croup commonly follows a short upper respiratory viral prodrome.'},
      {id:'cf_upper',label:'Inspiratory upper-airway\nobstruction',nodeType:'sign',from:['ev_stridor_voice'],tooltip:'Inspiratory stridor and hoarseness indicate upper-airway narrowing around the larynx/subglottis.'},
      {id:'cf_no_epi',label:'Absence of drooling\nor dysphagia',nodeType:'sign',from:['ev_swallow'],tooltip:'Normal swallowing helps exclude epiglottitis and deep neck infection.'},
    ],
    mechs:[
      {id:'m_subglottic',label:'Subglottic edema',nodeType:'mechanism',from:['cf_viral','cf_upper'],tooltip:'Viral inflammation and edema in the subglottic airway produce hoarseness and inspiratory stridor.'},
    ],
    dx:{id:'dx',label:'Croup',nodeType:'diagnosis',from:['cf_age','m_subglottic','cf_no_epi'],tooltip:'Croup is supported by toddler age, viral prodrome, upper-airway obstruction, and absence of epiglottitis red flags.'},
    excludeCards:[
      {target:'Epiglottitis',supports:['ev_stridor_voice'],against:['ev_swallow'],expected:'Drooling / dysphagia\ntoxic child',expectedExplanation:'Epiglottitis usually causes drooling, dysphagia, toxic appearance, and high fever.',explanation:'Fever and stridor make epiglottitis plausible, but normal swallowing and no drooling argue against it.'},
      {target:'Bacterial tracheitis',supports:['ev_uri','ev_stridor_voice'],against:['ev_uri'],expected:'High fever\ntoxic appearance\npurulent secretions',expectedExplanation:'Bacterial tracheitis is expected to cause high fever, toxic appearance, and purulent tracheal secretions.',explanation:'A viral prodrome and stridor are plausible, but the child is not severely ill and has only mild fever.'},
      {target:'Foreign body aspiration',supports:['ev_stridor_voice'],against:['ev_uri'],expected:'Choking episode\nabrupt onset',expectedExplanation:'Foreign body aspiration would usually involve choking or abrupt onset without infectious prodrome.',explanation:'Noisy breathing keeps foreign body aspiration plausible, but the viral prodrome and fever support croup instead.'},
      {target:'Retropharyngeal abscess',supports:['ev_uri'],against:['ev_swallow'],expected:'Dysphagia\nneck stiffness\nmuffled voice',expectedExplanation:'Retropharyngeal abscess is expected to cause dysphagia, neck stiffness/torticollis, and muffled voice.',explanation:'Fever/upper airway symptoms can make it plausible, but normal swallowing and no neck findings argue against it.'},
    ]
  },
};

function applySemanticEvidenceTypes(){
  const applyMap=(taskObj,map)=>{
    if(!taskObj||!taskObj.kgData||!Array.isArray(taskObj.kgData.evidence))return;
    taskObj.kgData.evidence.forEach(ev=>{ if(map[ev.id]) ev.nodeType=map[ev.id]; });
  };
  applyMap(tasks[1],{ev1:'symptom',ev2:'history',ev3:'history',ev4:'sign',ev5:'exclusion'});
  applyMap(tasks[2],{ev1:'sign',ev2:'symptom',ev3:'history',ev4:'symptom',ev5:'sign'});
  applyMap(tasks[3],{ev_age:'demographic',ev_uri:'history',ev_bark:'symptom',ev_named:'quality',ev_stridor:'sign',ev_well:'sign',ev_swallow:'exclusion',ev_parent:'quality'});
  applyMap(task3ImprovedTemplate,{ev_age:'demographic',ev_uri:'history',ev_stridor_voice:'sign',ev_swallow:'exclusion'});
}
applySemanticEvidenceTypes();
const originalTasks=JSON.parse(JSON.stringify(tasks));

// ══════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════
let currentTask=1;
let textExplainOpen=false;
let kgExplainOpen=true;
let editOpen=false;
let focusedKgNodeId=null;
let selectedGraphItem=null;
let kgNodeDragOffsets=JSON.parse(localStorage.getItem('pediatric_mcq_node_drag_offsets')||'{}');
let miniGraphDragOffsets=JSON.parse(localStorage.getItem('pediatric_mcq_mini_drag_offsets')||'{}');
let activeMiniDrag=null;
let suppressNextMiniClick=false;
let suppressNextGraphClick=false;
let task3Regenerated=false;
let task3SupportMode='kg';
let task3SelectedCluesToRemove=new Set();
let task3ClueEditMode=false;
let explanationVisible=true;
let hideExplanationAfterLoad=false;
let revisedTasks=new Set();
let reviewStore=JSON.parse(localStorage.getItem('resp_mcq_review_store')||'{}');
let edgeLabelOverrides=JSON.parse(localStorage.getItem('resp_mcq_edge_labels')||'{}');

const TASK3_CLUE_CANDIDATES=[
  {id:'ev_age',label:'Toddler age (2 years)',tag:'core clue',recommend:'keep'},
  {id:'ev_uri',label:'Viral upper respiratory prodrome',tag:'core clue',recommend:'keep'},
  {id:'ev_bark',label:'Barking / seal-bark cough',tag:'strong clue',recommend:'weaken'},
  {id:'ev_named',label:'“classic croup-like cough” wording',tag:'too direct',recommend:'remove'},
  {id:'ev_stridor',label:'Inspiratory stridor + hoarseness',tag:'core clue',recommend:'keep'},
  {id:'ev_well',label:'Non-toxic appearance',tag:'exclusion clue',recommend:'weaken'},
  {id:'ev_swallow',label:'No drooling / normal swallowing',tag:'exclusion clue',recommend:'weaken'},
  {id:'ev_parent',label:'“Could this be croup?”',tag:'answer cue',recommend:'remove'}
];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function escReg(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function persistReviewState(){
  localStorage.setItem('resp_mcq_review_store',JSON.stringify(reviewStore));
  localStorage.setItem('resp_mcq_edge_labels',JSON.stringify(edgeLabelOverrides));
}
function dragOffsetKey(id){return `${currentTask}:${id}`;}
function getDraggableNodePosition(id,cx,cy){
  const off=kgNodeDragOffsets[dragOffsetKey(id)]||{x:0,y:0};
  return {cx:cx+(off.x||0),cy:cy+(off.y||0)};
}
function setDraggableNodeOffset(id,dx,dy){
  kgNodeDragOffsets[dragOffsetKey(id)]={x:dx,y:dy};
  localStorage.setItem('pediatric_mcq_node_drag_offsets',JSON.stringify(kgNodeDragOffsets));
}
function miniDragKey(cardIndex,nodeId){return `${currentTask}:mini:${cardIndex}:${nodeId}`;}
function getMiniDragOffset(cardIndex,nodeId){
  return miniGraphDragOffsets[miniDragKey(cardIndex,nodeId)]||{x:0,y:0};
}
function setMiniDragOffset(cardIndex,nodeId,dx,dy){
  miniGraphDragOffsets[miniDragKey(cardIndex,nodeId)]={x:dx,y:dy};
  localStorage.setItem('pediatric_mcq_mini_drag_offsets',JSON.stringify(miniGraphDragOffsets));
}
function getDragBaseFromElement(el){
  return {
    id:el.getAttribute('data-node'),
    baseCx:Number(el.getAttribute('data-base-cx')),
    baseCy:Number(el.getAttribute('data-base-cy')),
    currentDx:Number(el.getAttribute('data-dx')||0),
    currentDy:Number(el.getAttribute('data-dy')||0),
  };
}

// ══════════════════════════════════════════════════════════════
// VIGNETTE HIGHLIGHTING
// ══════════════════════════════════════════════════════════════
function getEvidenceHighlights(task){
  const evidence=(task.kgData&&task.kgData.evidence)||[];
  return evidence.flatMap(ev=>{
    const phrases=Array.isArray(ev.phrase)?ev.phrase:(ev.phrase?[ev.phrase]:[]);
    return phrases.map(p=>({id:ev.id,phrase:p,len:p.length}));
  }).sort((a,b)=>b.len-a.len);
}


function getTaskDisplayVignette(task){
  let v=String((task&&task.vignette)||'');
  if(currentTask!==3 || (tasks[3]||{}).regenerated || !task3SelectedCluesToRemove || task3SelectedCluesToRemove.size===0){
    return v;
  }
  const removed=id=>task3SelectedCluesToRemove.has(id);

  // Task 3 uses a redacted preview: deleting a clue removes the corresponding
  // surface wording from the vignette, while keeping the original task data intact
  // for Reset and Regenerate.
  if(removed('ev_age')){
    v=v.replace(/^A 2-year-old boy is brought\b/i,'A child is brought');
    v=v.replace(/\b2-year-old boy\b/gi,'child');
  }
  if(removed('ev_uri')){
    v=v.replace(/\s*For the past two days, he has had a runny nose and a low-grade fever\.\s*/i,' ');
  }

  const bark=removed('ev_bark');
  const named=removed('ev_named');
  if(bark && named){
    v=v.replace(/\s*His parents say his cough sounds exactly like a “seal bark,” and the clinician notes that this is a classic croup-like cough\.\s*/i,' ');
  } else if(bark){
    v=v.replace(/His parents say his cough sounds exactly like a “seal bark,” and the clinician notes that /i,'The clinician notes that ');
  } else if(named){
    v=v.replace(/, and the clinician notes that this is a classic croup-like cough/i,'');
  }

  if(removed('ev_well')){
    v=v.replace(/\s*On examination, he is alert, playful, and sitting comfortably in his mother’s lap\.\s*/i,' On examination, he is sitting in his mother’s lap. ');
  }
  if(removed('ev_stridor')){
    v=v.replace(/\s*He has inspiratory stridor and a hoarse voice\.\s*/i,' ');
  }
  if(removed('ev_swallow')){
    v=v.replace(/\s*He is not drooling, has no difficulty swallowing, and can drink water normally\.\s*/i,' ');
  }
  if(removed('ev_parent')){
    v=v.replace(/\s*His parents ask whether this could be croup\.\s*/i,' ');
  }

  return v
    .replace(/\s+([,.;:!?])/g,'$1')
    .replace(/\s{2,}/g,' ')
    .replace(/\.\s*\./g,'.')
    .trim();
}

function highlight(v,task){
  let html=esc(v);
  getEvidenceHighlights(task).forEach(item=>{
    const pattern=escReg(esc(item.phrase));
    html=html.replace(new RegExp(pattern,'i'),m=>`<span class="hl-core linkable" data-evid="${item.id}">${m}</span>`);
  });
  return html;
}

function renderCurrentVignette(){
  const t=tasks[currentTask];
  const vignetteEl=document.getElementById('vignette');
  if(!t||!vignetteEl)return;
  vignetteEl.innerHTML=highlight(getTaskDisplayVignette(t),t);
  // Rebind span hover events because the vignette DOM is replaced.
  document.querySelectorAll('.hl-core[data-evid]').forEach(el=>{
    const evid=el.dataset.evid;
    el.onmouseenter=()=>setLinkedEvidenceState(evid,true);
    el.onmouseleave=()=>setLinkedEvidenceState(evid,false);
  });
  updateSelectedClueHighlights();
}

function setLinkedEvidenceState(evid,active){
  document.querySelectorAll(`.hl-core[data-evid="${evid}"]`).forEach(el=>el.classList.toggle('active-link',active));
  document.querySelectorAll('.kg-node[data-evid]').forEach(el=>{
    const evids=(el.dataset.evid||'').split('|').filter(Boolean);
    if(evids.includes(evid)) el.classList.toggle('active',active);
  });
}

function scrollToVignette(evids=[]){
  const vc=document.getElementById('vignetteSection');
  if(vc){
    vc.scrollIntoView({behavior:'smooth',block:'nearest'});
    vc.classList.add('vignette-flash');
    setTimeout(()=>vc.classList.remove('vignette-flash'),1200);
  }
  evids.forEach(evid=>{
    document.querySelectorAll(`.hl-core[data-evid="${evid}"]`).forEach(el=>{
      el.classList.add('active-link','click-focus');
      setTimeout(()=>el.classList.remove('active-link','click-focus'),1400);
    });
  });
}

function bindEvidenceInteractions(){
  document.querySelectorAll('.hl-core[data-evid]').forEach(el=>{
    const evid=el.dataset.evid;
    el.onmouseenter=()=>setLinkedEvidenceState(evid,true);
    el.onmouseleave=()=>setLinkedEvidenceState(evid,false);
  });
  document.querySelectorAll('.kg-node[data-evid]').forEach(el=>{
    const evids=(el.dataset.evid||'').split('|').filter(Boolean);
    const task3Eligible=currentTask===3 && !(tasks[3]||{}).regenerated && evids.some(evid=>TASK3_CLUE_CANDIDATES.some(c=>c.id===evid));
    if(task3Eligible) el.classList.add('task3-clue-node');
    if(task3Eligible && task3ClueEditMode) el.classList.add('task3-editable');
    el.addEventListener('mouseenter',()=>evids.forEach(evid=>setLinkedEvidenceState(evid,true)));
    el.addEventListener('mouseleave',()=>evids.forEach(evid=>setLinkedEvidenceState(evid,false)));
    el.addEventListener('click',()=>{
      if(task3ClueEditMode) return;
      scrollToVignette(evids);
    });
  });
  document.querySelectorAll('.task3-delete-badge[data-evid]').forEach(el=>{
    // Important: the parent .kg-node also has pointerdown drag logic.
    // Stop pointerdown here, otherwise the drag handler can prevent the later click.
    el.addEventListener('pointerdown',(evt)=>{
      evt.preventDefault();
      evt.stopPropagation();
    });
    el.addEventListener('click',(evt)=>{
      evt.preventDefault();
      evt.stopPropagation();
      const evids=(el.dataset.evid||'').split('|').filter(Boolean).filter(id=>TASK3_CLUE_CANDIDATES.some(c=>c.id===id));
      if(!evids.length) return;
      const anyUnselected=evids.some(id=>!task3SelectedCluesToRemove.has(id));
      const labels=TASK3_CLUE_CANDIDATES.filter(c=>evids.includes(c.id)).map(c=>c.label).join(', ');
      requestClueDelete(evids);
    });
  });
}

// ══════════════════════════════════════════════════════════════
// TOOLTIP
// ══════════════════════════════════════════════════════════════
const tooltip=document.getElementById('kgTooltip');
const tooltipTitle=document.getElementById('kgTooltipTitle');
const tooltipBody=document.getElementById('kgTooltipBody');

function cleanTooltipText(text){
  let t=String(text||'').trim();
  t=t.replace(/^LLM rationale:\s*/i,'');
  t=t.replace(/^KG edge:\s*[^.]+\.\s*/i,'');
  t=t.replace(/^The case [^.]+ maps to the KG concept "[^"]+"\.\s*/i,'');
  return t;
}
function prettyTooltipTitle(title){
  const raw=String(title||'').trim();
  if(!raw)return '';
  const map={
    demographic:'Demographic',
    symptom:'Symptom',
    sign:'Sign',
    history:'History',
    course:'Course',
    anatomy:'Anatomy',
    mechanism:'Mechanism',
    disorder:'Disorder',
    diagnosis:'Diagnosis',
    risk:'Risk factor',
    syndrome:'Syndrome',
    finding:'Finding',
    pattern:'Anatomy',
    mech:'Mechanism',
    dx:'Diagnosis',
    maps_to:'Maps to',
    manifestation_of:'Manifestation of',
    pathophysiology_of:'Pathophysiology of',
    complication_of:'Complication of',
    sign_of:'Sign of',
    finding_of:'Finding of',
    risk_factor_for:'Risk factor for',
    predisposes_to:'Predisposes to',
    supports:'Supports',
    causes:'Causes',
    localizes_to:'Localizes to',
    has_pathophysiology:'Has pathophysiology'
  };
  const key=raw.toLowerCase();
  return map[key] || raw.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}
function showTooltip(e,title,body){
  tooltipTitle.textContent=prettyTooltipTitle(title);
  tooltipBody.textContent=cleanTooltipText(body);
  tooltip.classList.add('visible');
  moveTooltip(e);
}
function moveTooltip(e){
  const margin=14, tw=260, th=120;
  let x=e.clientX+margin+20, y=e.clientY-40;
  if(x+tw>window.innerWidth-10) x=e.clientX-tw-margin;
  if(y+th>window.innerHeight-10) y=window.innerHeight-th-10;
  tooltip.style.left=x+'px'; tooltip.style.top=y+'px';
}
function hideTooltip(){tooltip.classList.remove('visible');}

// ══════════════════════════════════════════════════════════════
// LOAD TASK
// ══════════════════════════════════════════════════════════════
function loadTask(n){
  currentTask=n;
  if(n!==3) task3ClueEditMode=false; editOpen=false; focusedKgNodeId=null; selectedGraphItem=null;
  const t=tasks[n];
  const isRevised=!!(t&&t.revised) || revisedTasks.has(n);
  explanationVisible = isRevised ? false : (hideExplanationAfterLoad ? false : true);
  hideExplanationAfterLoad = false;
  // Task 2 starts in KG-only mode: graph visible, hover text disabled.
  // Task 3 hover text depends on the selected support mode.
  kgExplainOpen = (n===2 || n===3) ? false : true;
  // Nav tabs
  [1,2,3].forEach(i=>document.getElementById('navTab'+i).classList.remove('active'));
  document.getElementById('navTab'+n).classList.add('active');
  document.getElementById('navChip').textContent=t.chip;

  // Vignette + question
  renderCurrentVignette();
  document.getElementById('sourceTag').innerHTML=`<div class="source-badge">📖 <strong>${esc(t.source)}</strong></div>`;
  document.getElementById('stem').textContent=t.question_stem;
  renderOptions();

  const dc=document.getElementById('diffChip');
  dc.textContent=t.difficulty; dc.className='diff-chip '+t.difficulty.toLowerCase();

  // Edit section
  document.getElementById('editSection').classList.add('hidden');
  document.querySelector('.actions-section')?.classList.remove('editing');
  renderActions();

  // Explanation panels
  const rightPanel=document.getElementById('rightTextPanel');
  const rightBody=document.getElementById('rightTextBody');
  const explainBtn=document.getElementById('explainBtn');
  const kgTextPanel=document.getElementById('kgTextPanel');
  const kgHeaderExplainBtn=document.getElementById('kgHeaderExplainBtn');
  kgTextPanel.classList.remove('open');

  const rightPanelHead=rightPanel.querySelector('.right-text-panel-head');
  if(t.mode==='text'){
    rightPanel.style.display='block';
    if(rightPanelHead) rightPanelHead.style.display='none';
    rightBody.classList.add('open');
    explainBtn.textContent='Hide explanation ↑';
    explainBtn.classList.add('active');
    kgHeaderExplainBtn.style.display='flex';
    renderTextExplanation();
    updateTextExplainControl();
  } else {
    rightPanel.style.display='none';
    if(rightPanelHead) rightPanelHead.style.display='flex';
    kgHeaderExplainBtn.style.display='flex';
    updateKgExplainControl();
  }

  // KG
  renderKG();

  updateKgHint();
  updateTask3SupportSwitch();
  renderTask3CluePanel();
  if(n===3) applyTask3SupportMode(false);
  applyExplanationVisibility(false);
}

function updateKgHint(){
  const t=tasks[currentTask];
  const hint=document.getElementById('kgHint');
  const kgTitle=document.getElementById('kgPanelTitle');
  if(!hint||!kgTitle||!t)return;
  if(!explanationVisible){
    const revised=!!(t&&t.revised) || revisedTasks.has(currentTask);
    kgTitle.textContent=revised?'Reasoning support · disabled after revision':'Reasoning support · hidden';
    hint.textContent=revised?'Explanation is disabled after revised.':'Explanation is hidden. Use “Show explanation” to reopen the support panel.';
  } else if(currentTask===3){
    if(task3SupportMode==='text'){
      kgTitle.textContent='Text explanation · Question review';
      hint.textContent='Text support is selected. Switch to KG to edit clue nodes directly in the graph.';
    } else if(kgExplainOpen){
      kgTitle.textContent='Knowledge graph · KG + enriched text support';
      hint.textContent='KG is selected. Enriched hover text is on; hover over nodes or edges for reasoning text.';
    } else {
      kgTitle.textContent='Knowledge graph · KG support';
      hint.textContent='KG is selected. Use the enriched text switch inside the graph if extra hover reasoning is needed.';
    }
  } else if(t.mode==='kg'){
    kgTitle.textContent='Knowledge graph · KG review';
    hint.textContent=kgExplainOpen
      ? 'Hover explanation is enabled. Move over nodes or edges to see additional reasoning text.'
      : 'KG-only condition: review the graph structure without text explanation.';
  } else if(t.mode==='both'){
    kgTitle.textContent='Knowledge graph · KG explanation';
    hint.textContent=kgExplainOpen
      ? 'Hover explanation is enabled. Move over nodes or edges to see additional reasoning text.'
      : 'Graph is visible without hover text. Turn on hover explanation if needed.';
  } else {
    hint.textContent='Text-only condition: review the written explanation without the KG.';
    kgTitle.textContent='Reasoning support · Text explanation';
  }
}

function renderOptions(){
  const t=tasks[currentTask],el=document.getElementById('options');
  el.innerHTML='';
  Object.entries(t.options).forEach(([letter,text])=>{
    const row=document.createElement('div');
    row.className='option '+(letter===t.correct?'correct':'');
    row.onclick=()=>{document.querySelectorAll('.option').forEach(o=>o.style.outline='');row.style.outline='2px solid var(--accent)';};
    row.innerHTML=`<div class="letter">${letter}</div><div>${esc(text)}</div>${letter===t.correct?'<div class="badge">Correct</div>':''}`;
    el.appendChild(row);
  });
}

function toggleTextExplain(){
  const body=document.getElementById('rightTextBody');
  const btn=document.getElementById('explainBtn');
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  btn.textContent=isOpen?'Show explanation ↓':'Hide explanation ↑';
  btn.classList.toggle('active',!isOpen);
  updateTextExplainControl();
}


function renderTextExplanation(){
  const t=tasks[currentTask];
  const why=document.getElementById('textWhy');
  why.innerHTML=`<div class="why-title">Why "${esc(t.options[t.correct])}" is correct</div><ul class="evidence-list">${t.supporting.map(e=>`<li><strong>"${esc(e.phrase)}"</strong> — ${esc(e.why)}</li>`).join('')}</ul>`;
  document.getElementById('textDistractors').innerHTML=t.distractors.map(d=>`<div class="dc"><h4>${esc(d.disease)}</h4><p><strong>Plausible:</strong> ${esc(d.plausible)}</p><p><strong>Why incorrect:</strong> ${esc(d.incorrect)}</p></div>`).join('');
}

function renderKgTextExplanation(){
  const t=tasks[currentTask];
  document.getElementById('kgTextWhy').innerHTML=`<div class="why-title">Why "${esc(t.options[t.correct])}" is correct</div><ul class="evidence-list">${t.supporting.map(e=>`<li><strong>"${esc(e.phrase)}"</strong> — ${esc(e.why)}</li>`).join('')}</ul>`;
  document.getElementById('kgTextDistractors').innerHTML=t.distractors.map(d=>`<div class="dc"><h4>${esc(d.disease)}</h4><p><strong>Plausible:</strong> ${esc(d.plausible)}</p><p><strong>Why incorrect:</strong> ${esc(d.incorrect)}</p></div>`).join('');
}

function isCurrentTaskRevised(){
  const t=tasks[currentTask]||{};
  return !!t.revised || revisedTasks.has(currentTask);
}

function updateTextExplainControl(){
  updateKgExplainControl();
}
function toggleHeaderExplain(){
  if(isCurrentTaskRevised()){
    explanationVisible=false;
    applyExplanationVisibility(false);
    showToast('Explanation is disabled after revised.');
    return;
  }
  explanationVisible=!explanationVisible;
  applyExplanationVisibility(true);
}

function updateKgExplainControl(){
  const btn=document.getElementById('kgHeaderExplainBtn');
  if(!btn)return;
  const revised=isCurrentTaskRevised();
  btn.textContent=revised?'Explanation disabled after revised':(explanationVisible?'Hide explanation':'Show explanation');
  btn.classList.toggle('active',explanationVisible && !revised);
  btn.disabled=revised;
  btn.style.opacity=revised?'.55':'1';
  btn.style.cursor=revised?'not-allowed':'pointer';
  btn.setAttribute('aria-expanded',explanationVisible&&!revised?'true':'false');
  btn.setAttribute('aria-label',revised?'Explanation disabled after revised':'Toggle explanation visibility');
}

function toggleKgExplain(){
  // Kept for backward compatibility with older buttons.
  toggleHeaderExplain();
}

function applyExplanationVisibility(shouldRender=false){
  const t=tasks[currentTask];
  const btn=document.getElementById('kgHeaderExplainBtn');
  if(btn)btn.style.display='flex';
  updateKgExplainControl();
  hideTooltip();

  const kgBoard=document.getElementById('kgBoard');
  const exclude=document.getElementById('kgExcludeWrap');
  const path=document.getElementById('pathText');
  const rightPanel=document.getElementById('rightTextPanel');
  const rightBody=document.getElementById('rightTextBody');
  const kgTextPanel=document.getElementById('kgTextPanel');
  const task3Switch=document.getElementById('task3SupportSwitch');

  if(!explanationVisible){
    if(kgBoard){
      kgBoard.style.display='none';
    }
    if(exclude)exclude.style.display='none';
    if(path)path.style.display='none';
    if(rightPanel)rightPanel.style.display='none';
    if(rightBody)rightBody.classList.remove('open');
    if(kgTextPanel)kgTextPanel.classList.remove('open');
    if(task3Switch)task3Switch.style.display='none';
    renderTask3CluePanel();
    updateKgHint();
    return;
  }

  if(t.mode==='text'){
    if(rightPanel)rightPanel.style.display='block';
    if(rightBody)rightBody.classList.add('open');
    if(kgBoard)kgBoard.style.display='none';
    if(exclude)exclude.style.display='none';
    if(path)path.style.display='none';
  } else if(currentTask===3){
    if(task3Switch)task3Switch.style.display='flex';
    applyTask3SupportMode(shouldRender);
  } else {
    if(rightPanel)rightPanel.style.display='none';
    if(kgBoard)kgBoard.style.display='block';
    if(path)path.style.display='block';
    if(shouldRender)renderKG();
    renderExcludeCards();
  }
  updateTask3SupportSwitch();
  renderTask3CluePanel();
  updateKgHint();
}

// ══════════════════════════════════════════════════════════════
// EDIT
// ══════════════════════════════════════════════════════════════
function toggleEdit(force){
  const section=document.getElementById('editSection');
  const actions=document.querySelector('.actions-section');
  editOpen=(force===undefined)?!editOpen:force;
  if(editOpen){
    const t=tasks[currentTask];
    document.getElementById('editStem').value=t.question_stem;
    document.getElementById('editVignette').value=t.vignette;
    ['A','B','C','D','E'].forEach(l=>document.getElementById('edit'+l).value=t.options[l]||'');
    document.getElementById('editCorrect').value=t.correct;
    section.classList.remove('hidden');
    actions?.classList.add('editing');
    autoGrowEditTextareas();
    setTimeout(()=>section.scrollIntoView({behavior:'smooth',block:'nearest'}),40);
  } else {
    section.classList.add('hidden');
    actions?.classList.remove('editing');
  }
}

function autoGrowEditTextareas(){
  ['editStem','editVignette'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.style.height='auto';
    el.style.height=Math.max(id==='editVignette'?132:70,el.scrollHeight+4)+'px';
    el.oninput=()=>{el.style.height='auto';el.style.height=Math.max(id==='editVignette'?132:70,el.scrollHeight+4)+'px';};
  });
}

function saveEdits(){
  const t=tasks[currentTask];
  t.question_stem=document.getElementById('editStem').value;
  t.vignette=document.getElementById('editVignette').value;
  ['A','B','C','D','E'].forEach(l=>t.options[l]=document.getElementById('edit'+l).value);
  t.correct=document.getElementById('editCorrect').value;
  t.revised=true;
  revisedTasks.add(currentTask);
  explanationVisible=false;
  toggleEdit(false);
  loadTask(currentTask);
  showToast('Edits saved. Explanation is disabled after revised.');
}

// ══════════════════════════════════════════════════════════════
// KG RENDERING ENGINE
// ══════════════════════════════════════════════════════════════
const NODE_TYPE_LABELS={
  evidence:'Vignette evidence',
  demographic:'Context',
  symptom:'Symptom',
  sign:'Sign',
  history:'History',
  course:'Course',
  anatomy:'Pattern',
  mechanism:'Mechanism',
  disorder:'Disorder',
  diagnosis:'Diagnosis',
  quality:'Quality issue',
  exclusion:'Exclusion clue',
  // backward-compatible layout aliases
  finding:'Symptom',
  pattern:'Pattern',
  mech:'Mechanism',
  dx:'Diagnosis'
};
const NODE_COLORS={
  evidence:{fill:'#edf7f2',stroke:'#1a6b3c'},
  demographic:{fill:'#eef2ff',stroke:'#4f46e5'},
  symptom:{fill:'#fef3c7',stroke:'#d97706'},
  sign:{fill:'#ecfdf5',stroke:'#059669'},
  history:{fill:'#fce7f3',stroke:'#be185d'},
  course:{fill:'#f5f3ff',stroke:'#7c3aed'},
  anatomy:{fill:'#f3e8ff',stroke:'#9333ea'},
  mechanism:{fill:'#ffedd5',stroke:'#ea580c'},
  disorder:{fill:'#f1f5f9',stroke:'#475569'},
  diagnosis:{fill:'#dbeafe',stroke:'#2563eb'},
  quality:{fill:'#f1f5f9',stroke:'#475569'},
  exclusion:{fill:'#ecfeff',stroke:'#0891b2'},
  // backward-compatible layout aliases
  finding:{fill:'#fef3c7',stroke:'#d97706'},
  pattern:{fill:'#f3e8ff',stroke:'#9333ea'},
  mech:{fill:'#ffedd5',stroke:'#ea580c'},
  dx:{fill:'#dbeafe',stroke:'#2563eb'},
};
const NODE_TYPE_BADGE_LABELS={
  evidence:'EVIDENCE',
  demographic:'CONTEXT',
  symptom:'SYMPTOM',
  sign:'SIGN',
  history:'HISTORY',
  course:'COURSE',
  anatomy:'PATTERN',
  mechanism:'MECHANISM',
  disorder:'DISORDER',
  diagnosis:'DIAGNOSIS',
  quality:'QUALITY',
  exclusion:'EXCLUSION',
  finding:'SYMPTOM',
  pattern:'PATTERN',
  mech:'MECHANISM',
  dx:'DIAGNOSIS'
};
function semanticTypeFor(node,fallback){
  if(node&&node.nodeType)return node.nodeType;
  return {evidence:'evidence',finding:'symptom',pattern:'anatomy',mech:'mechanism',dx:'diagnosis'}[fallback]||fallback||'symptom';
}
function semanticTypeLabel(node,fallback){
  return NODE_TYPE_LABELS[semanticTypeFor(node,fallback)]||'KG node';
}


function wrapText(text,maxChars){
  const lines=[];
  String(text).split('\n').forEach(part=>{
    const words=part.trim().split(' ');let cur='';
    words.forEach(w=>{const next=cur?cur+' '+w:w;if(next.length>maxChars&&cur){lines.push(cur);cur=w;}else cur=next;});
    if(cur)lines.push(cur);
  });
  return lines.slice(0,3);
}

function textWidthEstimate(text,font=13){
  const longest=String(text||'').split('\n').reduce((m,line)=>Math.max(m,line.trim().length),0);
  return Math.ceil(longest*font*0.62);
}

function makeNode(id,type,label,cx,cy,meta={}){
  const FONT=13.5,LH=18.5,PAD_X=18,PAD_TOP=16,PAD_BOTTOM=16;
  const baseWidth=158;
  const maxWidth=(type==='dx'||type==='diagnosis')?205:196;
  const boxWidth=Math.max(baseWidth,Math.min(maxWidth,textWidthEstimate(label,FONT)+PAD_X*2+18));
  const maxChars=Math.floor((boxWidth-18)/(FONT*0.58));
  const lines=wrapText(label,maxChars);
  const w=boxWidth,h=PAD_TOP+PAD_BOTTOM+lines.length*LH;
  const x=cx-w/2,y=cy-h/2;
  const displayType=meta.semanticType||semanticTypeFor(meta.nodeRef||{nodeType:type},type);
  const c=NODE_COLORS[displayType]||NODE_COLORS[type]||NODE_COLORS.finding;
  const classes=['kg-node',type==='evidence'?'evidence-node':''];
  if(meta.interactive)classes.push('interactive-node');
  if(meta.focused)classes.push('focus-node');
  if(meta.neighbor)classes.push('neighbor-node');
  if(meta.faded)classes.push('dimmed');
  if(meta.selected)classes.push('graph-selected');
  const evidAttr=meta.evid?` data-evid="${meta.evid}"`:'';
  const tooltipAttr=meta.tooltip?` data-tooltip-title="${esc(meta.tooltipTitle||type)}" data-tooltip="${esc(meta.tooltip)}"`:'';
  const off=kgNodeDragOffsets[dragOffsetKey(id)]||{x:0,y:0};
  let s=`<g class="${classes.join(' ').trim()}" data-node="${id}" data-base-cx="${cx-(off.x||0)}" data-base-cy="${cy-(off.y||0)}" data-dx="${off.x||0}" data-dy="${off.y||0}"${evidAttr}${tooltipAttr}>`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/>`;
  const textBlockH=(lines.length-1)*LH+FONT;
  const textTop=y+(h-textBlockH)/2+FONT-1;
  lines.forEach((l,i)=>{s+=`<text x="${cx}" y="${textTop+i*LH}" text-anchor="middle" font-size="${FONT}" font-weight="700" fill="#1a1814" font-family="DM Sans,sans-serif">${l}</text>`;});
  if(meta.showDeleteControl && meta.evid){
    const bx=x+w-16, by=y+16;
    const badgeClass=`task3-delete-badge${meta.deleteSelected?' selected':''}`;
    s+=`<g class="${badgeClass}" data-evid="${meta.evid}" data-node="${id}">`;
    s+=`<circle cx="${bx}" cy="${by}" r="11"/>`;
    s+=`<text x="${bx}" y="${by+4}" text-anchor="middle">×</text>`;
    s+='</g>';
  }
  s+='</g>';
  return{svg:s,cx,cy,w,h,right:cx+w/2,left:cx-w/2};
}

function makeEdge(from,to,label,color,meta={}){
  if(!from||!to)return'';
  // Smart connection: use right→left if nodes are roughly on same row,
  // otherwise pick the closer edge (top/bottom) to reduce visual clutter
  const dx=to.cx-from.cx;
  const dy=to.cy-from.cy;
  let ax,ay,bx,by;
  if(Math.abs(dx)>Math.abs(dy)*0.7){
    // Mostly horizontal — right edge to left edge
    ax=from.right; ay=from.cy;
    bx=to.left;    by=to.cy;
  } else if(dy>0){
    // Mostly going down — bottom to top
    ax=from.cx; ay=from.cy+from.h/2;
    bx=to.cx;   by=to.cy-to.h/2;
  } else {
    // Mostly going up — top to bottom
    ax=from.cx; ay=from.cy-from.h/2;
    bx=to.cx;   by=to.cy+to.h/2;
  }
  const cpx=(ax+bx)/2;
  const cpy=(ay+by)/2;
  const tooltipAttr=meta.tooltip?` data-tooltip-title="${esc(meta.tooltipTitle||label)}" data-tooltip="${esc(meta.tooltip)}"`:'';
  const classes=['kg-edge'];
  if(meta.interactive)classes.push('interactive-edge');
  if(meta.focused)classes.push('focus-edge');
  if(meta.neighbor)classes.push('neighbor-edge');
  if(meta.context)classes.push('context-edge');
  if(meta.selected)classes.push('graph-selected');
  const edgeAttr=meta.edgeId?` data-edge="${esc(meta.edgeId)}" data-from="${esc(meta.fromId||'')}" data-to="${esc(meta.toId||'')}" data-relation="${esc(label||'')}"`:'';
  let s=`<g class="${classes.join(' ').trim()}" style="cursor:${meta.interactive?'pointer':'default'}"${tooltipAttr}${edgeAttr}>`;
  s+=`<path d="M${ax},${ay} C${cpx},${ay} ${cpx},${by} ${bx},${by}" fill="none" stroke="transparent" stroke-width="12"/>`;
  s+=`<path d="M${ax},${ay} C${cpx},${ay} ${cpx},${by} ${bx},${by}" fill="none" stroke="${color}" stroke-width="1.8" marker-end="url(#karrow)"/>`;
  if(label){
    const mx=(ax+bx)/2,my=(ay+by)/2;
    const lw=label.length*6.4+14;
    const tightGap=Math.abs(bx-ax)<lw+22;
    const autoOffset=(label.length>10||tightGap)?(dy>=0?-26:26):0;
    const yOffset=(meta.labelOffsetY!==undefined && meta.labelOffsetY!==null)?meta.labelOffsetY:autoOffset;
    const ly=my+yOffset;
    s+=`<rect x="${mx-lw/2}" y="${ly-9}" width="${lw}" height="16" rx="8" fill="white" opacity="0.96"/>`;
    s+=`<text x="${mx}" y="${ly+3}" text-anchor="middle" font-size="10" font-weight="800" fill="${color}" font-family="DM Sans,sans-serif">${label}</text>`;
  }
  s+='</g>';
  return s;
}

function makeLegend(W,H,usedTypes=[]){
  const ordered=['evidence','demographic','symptom','sign','history','course','anatomy','mechanism','disorder','diagnosis'];
  const active=ordered.filter(key=>usedTypes.includes(key));
  if(!active.length)return '';
  const items=active.map(key=>({...(NODE_COLORS[key]||NODE_COLORS.symptom),label:NODE_TYPE_LABELS[key]||key}));
  const widths=items.map(it=>Math.max(82,it.label.length*7.2+28));
  const totalW=widths.reduce((a,b)=>a+b,0);
  const startX=Math.max(16,(W-totalW)/2);
  const y=H-28;
  let s='';
  let x=startX;
  items.forEach((it,i)=>{
    s+=`<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${it.fill}" stroke="${it.stroke}" stroke-width="1.6"/>`;
    s+=`<text x="${x+20}" y="${y+11}" font-size="10.5" fill="#6b6560" font-family="DM Sans,sans-serif" font-weight="650">${it.label}</text>`;
    x+=widths[i];
  });
  return s;
}



function cleanLabel(label){return String(label||'').replace(/\n/g,' ').replace(/\s+/g,' ').trim();}
function getNodeTypeLabel(type){return NODE_TYPE_LABELS[type]||NODE_TYPE_LABELS[{finding:'symptom',pattern:'anatomy',mech:'mechanism',dx:'diagnosis'}[type]]||'KG node';}
function getEvidenceById(kg,id){return (kg.evidence||[]).find(e=>e.id===id);}
function getFindingById(kg,id){return (kg.findings||[]).find(f=>f.id===id);}
function getMechanismById(kg,id){return (kg.mechs||[]).find(m=>m.id===id);}
function getPatternById(kg,id){return (kg.patterns||[]).find(p=>p.id===id);}
function getNodeRecord(kg,id){
  const ev=getEvidenceById(kg,id); if(ev)return {type:'evidence',node:ev};
  const f=getFindingById(kg,id); if(f)return {type:'finding',node:f};
  const p=getPatternById(kg,id); if(p)return {type:'pattern',node:p};
  const m=getMechanismById(kg,id); if(m)return {type:'mech',node:m};
  if(kg.dx&&kg.dx.id===id)return {type:'dx',node:kg.dx};
  return null;
}
function evidencePhrasesForNode(kg,id){
  const rec=getNodeRecord(kg,id); if(!rec)return[];
  let evidIds=[];
  if(rec.type==='evidence')evidIds=[id];
  else if(rec.type==='finding')evidIds=rec.node.from||[];
  else if(rec.type==='mech'){
    (rec.node.from||[]).forEach(fid=>{const f=getFindingById(kg,fid);if(f)evidIds.push(...(f.from||[]));});
  } else if(rec.type==='dx'){
    (rec.node.from||[]).forEach(src=>{
      const r=getNodeRecord(kg,src);
      if(!r)return;
      if(r.type==='finding')evidIds.push(...(r.node.from||[]));
      if(r.type==='mech')(r.node.from||[]).forEach(fid=>{const f=getFindingById(kg,fid);if(f)evidIds.push(...(f.from||[]));});
    });
  }
  evidIds=[...new Set(evidIds)];
  return evidIds.map(eid=>getEvidenceById(kg,eid)).filter(Boolean).map(e=>e.phrase||e.short||e.label);
}
function relatedKnowledgeForCurrentTask(nodeType,nodeLabel){
  const t=tasks[currentTask];
  const target=(t.target||'').toLowerCase();
  const label=cleanLabel(nodeLabel).toLowerCase();
  if(target.includes('cystic fibrosis')||label.includes('cystic fibrosis')||label.includes('cftr')){
    return ['CFTR dysfunction','thick dehydrated mucus','impaired mucociliary clearance','pancreatic insufficiency','steatorrhoea','failure to thrive','recurrent pneumonia','digital clubbing','bronchiectasis','PCD as common distractor'];
  }
  if(target.includes('primary ciliary dyskinesia')||label.includes('ciliary')||label.includes('pcd')){
    return ['dynein arm / ciliary motility defect','poor mucociliary clearance','neonatal respiratory distress in term infant','lifelong wet cough','recurrent otitis media / sinusitis','bronchiectasis','normal pancreatic function','situs inversus may occur','CF as common distractor'];
  }
  if(target.includes('croup')||label.includes('croup')||label.includes('subglottic')){
    return ['viral URI prodrome','parainfluenza common','subglottic oedema','seal-bark cough','inspiratory stridor','hoarse voice','non-toxic appearance','epiglottitis / tracheitis as dangerous distractors','foreign body lacks fever/prodrome'];
  }
  return ['key vignette evidence','clinical pattern','mechanism / localization','correct diagnosis','distractor contrast'];
}
function roleTextForNode(type,label){
  if(type==='evidence')return 'Raw phrase from the vignette. It should be traceable directly to the case text.';
  if(type==='finding')return 'Intermediate clinical abstraction. It groups one or more raw clues into a medically meaningful pattern.';
  if(type==='mech')return 'Pathophysiological or anatomical explanation. It explains why the observed pattern supports the diagnosis.';
  if(type==='dx')return 'Final answer node. It should be supported by the full evidence-to-mechanism chain and should also contrast with distractors.';
  return 'Node in the reasoning graph.';
}
function renderNodeInsightPanel(selectedId){
  const t=tasks[currentTask],kg=t.kgData;
  const body=document.getElementById('nodeInsightBody'); if(!body||!kg)return;
  const id=selectedId||kg.dx.id;
  const rec=getNodeRecord(kg,id)||{type:'dx',node:kg.dx};
  const label=cleanLabel(rec.node.label||rec.node.short||rec.node.phrase||t.target);
  const phrases=evidencePhrasesForNode(kg,id);
  const related=relatedKnowledgeForCurrentTask(rec.type,label);
  body.innerHTML=`<div class="node-name">${esc(label)}</div>
    <div class="node-role">${esc(getNodeTypeLabel(rec.type))}</div>
    <p>${esc(roleTextForNode(rec.type,label))}</p>
    <div class="node-section"><strong>Supported by vignette evidence</strong>
      ${phrases.length?`<ul>${phrases.slice(0,6).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:'<p>No direct vignette evidence attached.</p>'}
    </div>
    <div class="node-section"><strong>Surrounding knowledge to consider</strong>
      <div class="surrounding-chip-row">${related.slice(0,10).map(x=>`<span class="surrounding-chip">${esc(x)}</span>`).join('')}</div>
    </div>
    <div class="node-section"><strong>Think-aloud prompt</strong>
      <p>Does this node help you verify the answer, or should it be renamed, expanded, or connected differently?</p>
    </div>`;
}
function renderEvidenceCoverage(){
  const t=tasks[currentTask],kg=t.kgData;
  const body=document.getElementById('evidenceCoverageBody'); if(!body||!kg)return;
  const rows=(kg.evidence||[]).map(ev=>{
    const mappedFindings=(kg.findings||[]).filter(f=>(f.from||[]).includes(ev.id)).map(f=>cleanLabel(f.label));
    return `<div class="coverage-row" data-evid="${esc(ev.id)}">
      <div class="coverage-check">✓</div>
      <div><div class="coverage-phrase">${esc(ev.phrase||ev.short||cleanLabel(ev.label))}</div>
      <div class="coverage-map">maps to: ${esc(mappedFindings.join(' · ')||'not mapped')}</div></div>
    </div>`;
  }).join('');
  body.innerHTML=rows+`<div class="mini-graph-note">Click a row to jump back to the corresponding phrase in the vignette.</div>`;
  body.querySelectorAll('.coverage-row[data-evid]').forEach(row=>{
    const evid=row.getAttribute('data-evid');
    row.addEventListener('mouseenter',()=>setLinkedEvidenceState(evid,true));
    row.addEventListener('mouseleave',()=>setLinkedEvidenceState(evid,false));
    row.addEventListener('click',()=>scrollToVignette([evid]));
  });
}

function renderExpertReviewPanel(){
  const panel=document.getElementById('expertReviewPanel');
  const body=document.getElementById('expertReviewBody');
  const chip=document.getElementById('reviewStatusChip');
  const t=tasks[currentTask],kg=t.kgData;
  if(!panel||!body||!chip)return;
  panel.style.display='none';
  return;
  if(t.mode==='text'||!kgExplainOpen){
    panel.style.display='none';
    return;
  }
  panel.style.display='block';
  if(!selectedGraphItem){
    chip.textContent='No selection';
    chip.className='review-status';
    body.innerHTML=`<div class="review-empty">Click a node or edge in the graph. Experts can verify whether extracted evidence, concept mapping, mechanism edges, and answer-support edges are medically valid.</div>
      <div class="node-section"><strong>Suggested expert review flow</strong>
        <ul>
          <li>Check whether each vignette phrase is necessary and correctly extracted.</li>
          <li>Check whether each phrase maps to the right clinical concept.</li>
          <li>Click edges to verify whether the relation wording is too strong, too weak, or unsupported.</li>
          <li>Use the edit fields to rename nodes, revise relation labels, and leave audit notes.</li>
        </ul>
      </div>`;
    return;
  }
  const review=getReviewRecord();
  chip.textContent=statusLabel(review.status);
  chip.className='review-status '+statusClass(review.status);
  if(selectedGraphItem.type==='node'){
    const rec=getNodeRecord(kg,selectedGraphItem.id);
    if(!rec){body.innerHTML='<div class="review-empty">Selected node no longer exists.</div>';return;}
    const label=getNodeDisplayLabel(rec);
    const phrases=evidencePhrasesForNode(kg,selectedGraphItem.id);
    const related=relatedKnowledgeForCurrentTask(rec.type,label).slice(0,8);
    body.innerHTML=`<div class="audit-row"><div class="audit-label">Element</div><div class="audit-value">${esc(getNodeTypeLabel(rec.type))}</div></div>
      <div class="audit-row"><div class="audit-label">Node ID</div><div>${esc(selectedGraphItem.id)}</div></div>
      <div class="audit-row"><div class="audit-label">Provenance</div><div>${rec.type==='evidence'?'Direct phrase from vignette':'Generated abstraction in the reasoning graph; requires expert validation.'}</div></div>
      <div class="audit-row"><div class="audit-label">Evidence</div><div>${phrases.length?phrases.map(p=>`<div>• ${esc(p)}</div>`).join(''):'No direct vignette evidence attached.'}</div></div>
      <div class="review-grid">
        <div class="review-field"><label>Editable node label</label><input class="review-input" id="reviewNodeLabel" value="${esc(label)}"></div>
        <div class="review-field"><label>Review issue</label><select class="review-select" id="reviewIssue"><option value="">No issue</option><option ${review.issue==='wrong_mapping'?'selected':''} value="wrong_mapping">Wrong concept mapping</option><option ${review.issue==='missing_evidence'?'selected':''} value="missing_evidence">Missing key evidence</option><option ${review.issue==='overstated'?'selected':''} value="overstated">Overstated wording</option><option ${review.issue==='ambiguous'?'selected':''} value="ambiguous">Ambiguous / unclear</option></select></div>
      </div>
      <div class="review-field" style="margin-top:10px"><label>Expert note</label><textarea class="review-textarea" id="reviewComment" placeholder="What should be corrected or verified?">${esc(review.comment||'')}</textarea></div>
      <div class="node-section"><strong>Context suggestions, not part of main chain</strong><div class="context-suggestions">${related.map(x=>`<span class="context-suggestion">${esc(x)}</span>`).join('')}</div></div>
      <div class="review-actions">
        <button class="review-mini-btn good" onclick="selectReviewStatus('accepted')">Accept node</button>
        <button class="review-mini-btn warn" onclick="selectReviewStatus('revise')">Needs revision</button>
        <button class="review-mini-btn bad" onclick="selectReviewStatus('rejected')">Reject node</button>
        <button class="review-mini-btn" onclick="applyGraphReviewEdit()">Apply edit</button>
      </div>`;
  } else {
    const fromRec=getNodeRecord(kg,selectedGraphItem.fromId);
    const toRec=getNodeRecord(kg,selectedGraphItem.toId);
    const relation=getEdgeLabel(selectedGraphItem.id,selectedGraphItem.relation||'related to');
    body.innerHTML=`<div class="audit-row"><div class="audit-label">Element</div><div class="audit-value">Reasoning edge</div></div>
      <div class="audit-row"><div class="audit-label">From</div><div>${esc(fromRec?getNodeDisplayLabel(fromRec):selectedGraphItem.fromId)}</div></div>
      <div class="audit-row"><div class="audit-label">To</div><div>${esc(toRec?getNodeDisplayLabel(toRec):selectedGraphItem.toId)}</div></div>
      <div class="audit-row"><div class="audit-label">Provenance</div><div>${esc(relationProvenance(selectedGraphItem.id,selectedGraphItem.relation))}</div></div>
      <div class="review-grid">
        <div class="review-field"><label>Editable relation</label><input class="review-input" id="reviewEdgeRelation" value="${esc(relation)}"></div>
        <div class="review-field"><label>Review issue</label><select class="review-select" id="reviewIssue"><option value="">No issue</option><option ${review.issue==='unsupported'?'selected':''} value="unsupported">Unsupported relation</option><option ${review.issue==='too_strong'?'selected':''} value="too_strong">Relation too strong</option><option ${review.issue==='too_weak'?'selected':''} value="too_weak">Relation too weak</option><option ${review.issue==='wrong_direction'?'selected':''} value="wrong_direction">Wrong direction</option></select></div>
      </div>
      <div class="review-field" style="margin-top:10px"><label>Expert note</label><textarea class="review-textarea" id="reviewComment" placeholder="What should be changed about this relation?">${esc(review.comment||'')}</textarea></div>
      <div class="review-actions">
        <button class="review-mini-btn good" onclick="selectReviewStatus('accepted')">Accept edge</button>
        <button class="review-mini-btn warn" onclick="selectReviewStatus('revise')">Needs revision</button>
        <button class="review-mini-btn bad" onclick="selectReviewStatus('rejected')">Reject edge</button>
        <button class="review-mini-btn" onclick="applyGraphReviewEdit()">Apply edit</button>
      </div>`;
  }
}

function selectReviewStatus(status){
  const issue=document.getElementById('reviewIssue')?.value||'';
  const comment=document.getElementById('reviewComment')?.value||'';
  setReviewRecord({status,issue,comment});
  renderExpertReviewPanel();
  showToast(statusLabel(status));
}

function applyGraphReviewEdit(){
  if(!selectedGraphItem)return;
  const issue=document.getElementById('reviewIssue')?.value||'';
  const comment=document.getElementById('reviewComment')?.value||'';
  if(selectedGraphItem.type==='node'){
    const label=document.getElementById('reviewNodeLabel')?.value.trim();
    if(label)updateNodeDisplayLabel(selectedGraphItem.id,label);
    setReviewRecord({issue,comment,edited:true});
  } else {
    const relation=document.getElementById('reviewEdgeRelation')?.value.trim();
    if(relation)setEdgeLabel(selectedGraphItem.id,relation);
    setReviewRecord({issue,comment,edited:true});
  }
  renderKG();
  showToast('Graph edit applied');
}

function renderKgUnderstandingPanels(){
  const t=tasks[currentTask];
  const show=false;
  const guide=document.getElementById('thinkGuide');
  const grid=document.getElementById('kgUnderstandingGrid');
  if(guide)guide.style.display=show?'block':'none';
  if(grid)grid.style.display=show?'grid':'none';
  if(!show)return;
  renderNodeInsightPanel();
  renderEvidenceCoverage();
}

function bindGraphNodeDragging(){
  const board=document.getElementById('kgBoard');
  const svg=board?board.querySelector('svg'):null;
  if(!board||!svg)return;
  let drag=null;
  const toSvgPoint=(evt)=>{
    const pt=svg.createSVGPoint();
    pt.x=evt.clientX; pt.y=evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  board.querySelectorAll('.kg-node[data-node]').forEach(el=>{
    el.addEventListener('pointerdown',(e)=>{
      if(e.button!==0)return;
      // Do not start node dragging when the user clicks the clue-delete × control.
      if(e.target.closest && e.target.closest('.task3-delete-badge')) return;
      const info=getDragBaseFromElement(el);
      if(!info.id)return;
      const p=toSvgPoint(e);
      drag={el,id:info.id,startX:p.x,startY:p.y,startDx:info.currentDx,startDy:info.currentDy,moved:false};
      el.classList.add('dragging');
      el.setPointerCapture?.(e.pointerId);
      hideTooltip();
      e.preventDefault();
      e.stopPropagation();
    });
  });
  const moveHandler=(e)=>{
    if(!drag)return;
    const p=toSvgPoint(e);
    const dx=drag.startDx+(p.x-drag.startX);
    const dy=drag.startDy+(p.y-drag.startY);
    if(Math.abs(dx-drag.startDx)>2||Math.abs(dy-drag.startDy)>2)drag.moved=true;
    drag.el.setAttribute('transform',`translate(${dx-drag.startDx},${dy-drag.startDy})`);
  };
  const upHandler=()=>{
    if(!drag)return;
    drag.el.classList.remove('dragging');
    if(drag.moved){
      const transform=drag.el.getAttribute('transform')||'translate(0,0)';
      const nums=transform.match(/-?\d+(?:\.\d+)?/g)||[0,0];
      const finalDx=drag.startDx+Number(nums[0]||0);
      const finalDy=drag.startDy+Number(nums[1]||0);
      setDraggableNodeOffset(drag.id,finalDx,finalDy);
      suppressNextGraphClick=true;
      setTimeout(()=>{suppressNextGraphClick=false;},160);
      selectedGraphItem=null;
      focusedKgNodeId=null;
      renderKG();
    }
    drag=null;
  };
  window.addEventListener('pointermove',moveHandler,{once:false});
  window.addEventListener('pointerup',upHandler,{once:false});
}

function bindNodeInsightClicks(){
  const kg=tasks[currentTask].kgData;
  document.querySelectorAll('.kg-node[data-node]').forEach(el=>{
    const id=el.getAttribute('data-node');
    if(id && id.startsWith('focus_ctx_'))return;
    el.addEventListener('click',(e)=>{
      if(suppressNextGraphClick){e.stopPropagation();return;}
      e.stopPropagation();
      selectedGraphItem={type:'node',id};
      const rec=getNodeRecord(kg,id);
      if(rec && rec.type==='evidence'){
        const evid=el.getAttribute('data-evid');
        if(evid)scrollToVignette([evid]);
        focusedKgNodeId=null;
        renderKG();
        return;
      }
      focusedKgNodeId = (focusedKgNodeId===id) ? null : id;
      renderKG();
    });
  });
  document.querySelectorAll('.kg-edge[data-edge]').forEach(el=>{
    el.addEventListener('click',(e)=>{
      if(suppressNextGraphClick){e.stopPropagation();return;}
      e.stopPropagation();
      selectedGraphItem={
        type:'edge',
        id:el.getAttribute('data-edge'),
        fromId:el.getAttribute('data-from'),
        toId:el.getAttribute('data-to'),
        relation:el.getAttribute('data-relation')
      };
      focusedKgNodeId=null;
      renderKG();
    });
  });
  const board=document.getElementById('kgBoard');
  if(board){
    board.onclick=(e)=>{
      if(e.target.closest && e.target.closest('.kg-node'))return;
      if(e.target.closest && e.target.closest('.kg-edge'))return;
      if(focusedKgNodeId){focusedKgNodeId=null;renderKG();}
    };
  }
}


function relatedIdsForFocus(kg,id){
  if(!id)return new Set();
  const ids=new Set([id]);
  const rec=getNodeRecord(kg,id);
  if(!rec)return ids;
  if(rec.type==='evidence'){
    (kg.findings||[]).forEach(f=>{if((f.from||[]).includes(id))ids.add(f.id);});
  } else if(rec.type==='finding'){
    (rec.node.from||[]).forEach(eid=>ids.add(eid));
    (kg.mechs||[]).forEach(m=>{if((m.from||[]).includes(id)){ids.add(m.id); if((kg.dx.from||[]).includes(m.id))ids.add(kg.dx.id);}});
    if((kg.dx.from||[]).includes(id))ids.add(kg.dx.id);
  } else if(rec.type==='mech'){
    (rec.node.from||[]).forEach(fid=>{ids.add(fid); const f=getFindingById(kg,fid); if(f)(f.from||[]).forEach(eid=>ids.add(eid));});
    if((kg.dx.from||[]).includes(id))ids.add(kg.dx.id);
  } else if(rec.type==='dx'){
    (kg.dx.from||[]).forEach(src=>{
      ids.add(src);
      const r=getNodeRecord(kg,src);
      if(r&&r.type==='finding')(r.node.from||[]).forEach(eid=>ids.add(eid));
      if(r&&r.type==='mech')(r.node.from||[]).forEach(fid=>{ids.add(fid); const f=getFindingById(kg,fid); if(f)(f.from||[]).forEach(eid=>ids.add(eid));});
    });
  }
  return ids;
}

function directNeighborIdsForFocus(kg,id){
  if(!id)return new Set();
  const ids=new Set();
  const rec=getNodeRecord(kg,id);
  if(!rec)return ids;
  if(rec.type==='evidence'){
    (kg.findings||[]).forEach(f=>{if((f.from||[]).includes(id))ids.add(f.id);});
  } else if(rec.type==='finding'){
    (rec.node.from||[]).forEach(eid=>ids.add(eid));
    (kg.mechs||[]).forEach(m=>{if((m.from||[]).includes(id))ids.add(m.id);});
    if((kg.dx.from||[]).includes(id))ids.add(kg.dx.id);
  } else if(rec.type==='mech'){
    (rec.node.from||[]).forEach(fid=>ids.add(fid));
    if((kg.dx.from||[]).includes(id))ids.add(kg.dx.id);
  } else if(rec.type==='dx'){
    (kg.dx.from||[]).forEach(src=>ids.add(src));
  }
  return ids;
}

function contextLabelsForFocusedNode(kg,id){
  const rec=getNodeRecord(kg,id);
  if(!rec || rec.type==='evidence')return [];
  const label=cleanLabel(rec.node.label||rec.node.short||rec.node.phrase||tasks[currentTask].target);
  let labels=relatedKnowledgeForCurrentTask(rec.type,label);
  if(rec.type==='finding'){
    const low=label.toLowerCase();
    if(low.includes('pancreatic')) labels=['fat malabsorption','poor weight gain','greasy stools','steatorrhoea','failure to thrive'];
    else if(low.includes('airway')||low.includes('mucociliary')) labels=['thick mucus','wet cough','recurrent pneumonia','bacterial colonisation','bronchiectasis'];
    else if(low.includes('hypoxia')||low.includes('clubbing')) labels=['chronic lung disease','digital clubbing','longstanding hypoxaemia','early-onset disease'];
    else labels=labels.slice(0,5);
  }
  if(rec.type==='mech'){
    const low=label.toLowerCase();
    if(low.includes('pancreatic')) labels=['CFTR dysfunction','blocked pancreatic ducts','fat malabsorption','steatorrhoea','poor growth'];
    else if(low.includes('mucociliary')) labels=['dehydrated airway surface','thick mucus','impaired clearance','recurrent infection','bronchiectasis'];
    else labels=labels.slice(0,5);
  }
  return [...new Set(labels)].slice(0,5);
}


function contextRelationForFocusedNode(kg,focusId,contextLabel){
  const rec=getNodeRecord(kg,focusId);
  const label=cleanLabel(contextLabel).toLowerCase();
  const focus=rec?cleanLabel(rec.node.label||rec.node.short||rec.node.phrase||'').toLowerCase():'';

  // Diagnosis-centered context: background knowledge around the final answer
  if(rec && rec.type==='dx'){
    if(label.includes('cftr') || label.includes('ciliary motility') || label.includes('viral uri')) return 'caused by';
    if(label.includes('thick') || label.includes('mucus') || label.includes('subglottic') || label.includes('oedema') || label.includes('clearance')) return 'leads to';
    if(label.includes('pancreatic') || label.includes('steator') || label.includes('failure') || label.includes('pneumonia') || label.includes('otitis') || label.includes('seal-bark') || label.includes('neonatal')) return 'presents with';
    if(label.includes('distractor') || label.includes('epiglottitis') || label.includes('tracheitis')) return 'contrasted with';
    if(label.includes('no pancreatic')) return 'helps exclude CF';
    return 'associated with';
  }

  // Mechanism-centered context: mechanisms often explain or cause downstream findings
  if(rec && rec.type==='mech'){
    if(label.includes('cftr') || label.includes('viral') || label.includes('dynein') || label.includes('ciliary')) return 'driven by';
    if(label.includes('blocked') || label.includes('dehydrated') || label.includes('thick') || label.includes('oedema')) return 'causes';
    if(label.includes('malabsorption') || label.includes('steator') || label.includes('poor growth') || label.includes('infection') || label.includes('bronchiectasis')) return 'results in';
    return 'mechanistically linked';
  }

  // Finding/pattern-centered context: findings are recognised through clues or imply a mechanism
  if(rec && rec.type==='finding'){
    if(label.includes('poor weight') || label.includes('greasy') || label.includes('wet cough') || label.includes('pneumonia') || label.includes('digital') || label.includes('stridor') || label.includes('seal')) return 'indicated by';
    if(label.includes('malabsorption') || label.includes('hypoxaemia') || label.includes('bacterial') || label.includes('subglottic') || label.includes('fat')) return 'suggests';
    if(label.includes('bronchiectasis') || label.includes('failure to thrive') || label.includes('early-onset')) return 'may progress to';
    return 'clinically linked';
  }

  return 'associated with';
}

function contextTooltipForFocusedNode(kg,focusId,contextLabel,relation){
  const rec=getNodeRecord(kg,focusId);
  const focusText=rec?cleanLabel(rec.node.label||rec.node.short||rec.node.phrase||'selected node'):'selected node';
  return `The selected node "${focusText}" is ${relation} "${cleanLabel(contextLabel)}". This is optional surrounding knowledge, not a required step in the main reasoning chain.`;
}

function graphReviewKey(item=selectedGraphItem){
  if(!item)return null;
  return `task${currentTask}:${item.type}:${item.id}`;
}
function getReviewRecord(item=selectedGraphItem){
  const key=graphReviewKey(item);
  return key?(reviewStore[key]||{}):{};
}
function setReviewRecord(patch,item=selectedGraphItem){
  const key=graphReviewKey(item);
  if(!key)return;
  reviewStore[key]={...(reviewStore[key]||{}),...patch,updated_at:new Date().toISOString()};
  persistReviewState();
}
function statusClass(status){
  if(status==='accepted')return 'accepted';
  if(status==='revise')return 'revise';
  if(status==='rejected')return 'rejected';
  return '';
}
function statusLabel(status){
  return {accepted:'Accepted',revise:'Needs revision',rejected:'Rejected'}[status]||'Unreviewed';
}
function edgeIdFor(fromId,toId,kind){return `${fromId}->${toId}:${kind}`;}
function getEdgeLabel(edgeId,defaultLabel){return edgeLabelOverrides[`task${currentTask}:${edgeId}`]||defaultLabel;}
function setEdgeLabel(edgeId,label){
  edgeLabelOverrides[`task${currentTask}:${edgeId}`]=label;
  persistReviewState();
}
function currentKg(){return tasks[currentTask]&&tasks[currentTask].kgData;}
function getNodeDisplayLabel(rec){
  if(!rec)return '';
  return cleanLabel(rec.node.short||rec.node.label||rec.node.phrase||tasks[currentTask].target);
}
function updateNodeDisplayLabel(id,label){
  const kg=currentKg();
  const rec=getNodeRecord(kg,id);
  if(!rec)return;
  if(rec.type==='evidence'){
    rec.node.short=label;
    rec.node.label=label;
  } else {
    rec.node.label=label;
  }
}
function relationProvenance(edgeId,relation){
  if(relation==='maps_to')return 'Concept mapping from original vignette phrase to a base KG concept.';
  if(relation==='forms_pattern')return 'Grouping relation: multiple KG concepts converge into an anatomical concept node.';
  if(relation==='causes')return 'Base KG causal relation; expert should verify direction and strength.';
  if(relation==='manifestation_of')return 'Base KG disease-phenotype relation from finding/mechanism to diagnosis.';
  if(relation==='sign_of')return 'Base KG clinical sign relation from an observed sign to the condition it indicates.';
  if(relation==='complication_of')return 'Base KG complication relation from a downstream complication to the underlying disease.';
  if(relation==='pathophysiology_of')return 'Base KG mechanism-disease relation.';
  if(relation==='risk_factor_for')return 'Base KG risk/epidemiology relation.';
  if(relation==='predisposes_to')return 'Interpretive epidemiology relation: this factor increases susceptibility to the linked concept.';
  if(relation==='finding_of')return 'Base KG clinical finding relation.';
  if(relation==='supports')return 'Interpretive KG relation: this finding supports the linked concept without directly diagnosing the disease.';
  if(relation==='has_pathophysiology')return 'Interpretive KG bridge from an anatomical concept to the underlying pathophysiology.';
  if(relation==='localizes_to')return 'Base KG relation: symptom/sign concepts localize to an anatomical finding.';
  if(relation==='helps_exclude')return 'Exclusion relation used only for hidden or distractor-specific reasoning.';
  return `Editable graph relation: ${edgeId}`;
}

function defaultFindingToMechanismRelation(findingLabel,mechanismLabel){
  const f=cleanLabel(findingLabel).toLowerCase();
  const m=cleanLabel(mechanismLabel).toLowerCase();
  if(f.includes('failure')&&m.includes('pancreatic'))return 'manifestation_of';
  if(f.includes('steator')&&m.includes('pancreatic'))return 'manifestation_of';
  if(f.includes('respiratory infection')&&m.includes('mucociliary'))return 'manifestation_of';
  if(f.includes('productive cough')&&m.includes('mucociliary'))return 'manifestation_of';
  if(f.includes('digital clubbing')&&m.includes('chronic lung'))return 'sign_of';
  if(f.includes('uri')&&m.includes('viral'))return 'causes';
  if(f.includes('subglottic airway')&&m.includes('subglottic oedema'))return 'has_pathophysiology';
  if(f.includes('subglottic')&&m.includes('subglottic'))return 'associated_with';
  return 'causes';
}

function defaultEvidenceToFindingRelation(findingLabel){
  const f=cleanLabel(findingLabel).toLowerCase();
  if(f.includes('absent')||f.includes('no pancreatic'))return 'helps_exclude';
  return 'maps_to';
}

function defaultDiagnosisRelation(nodeRecord,dxLabel){
  const label=cleanLabel(nodeRecord?.node?.label||'').toLowerCase();
  const type=nodeRecord?.type||'';
  if(label.includes('toddler age'))return 'risk_factor_for';
  if(label.includes('low-grade fever'))return 'finding_of';
  if(label.includes('subglottic airway'))return 'finding_of';
  if(label.includes('pancreatic insufficiency'))return 'manifestation_of';
  if(label.includes('impaired mucociliary'))return 'pathophysiology_of';
  if(label.includes('chronic lung disease'))return 'complication_of';
  if(label.includes('subglottic oedema'))return 'pathophysiology_of';
  if(label.includes('danger signs absent'))return 'helps_exclude';
  if(type==='finding')return 'finding_of';
  if(type==='mech')return 'pathophysiology_of';
  if(type==='pattern')return 'finding_of';
  return 'associated_with';
}

function relationSentence(sourceLabel,relation,targetLabel){
  return `KG edge: "${cleanLabel(sourceLabel)}" --${relation}--> "${cleanLabel(targetLabel)}".`;
}

function contextBubblePositions(focus,count,W,graphH){
  const rightSpace=W-(focus.right||focus.cx);
  const leftSpace=(focus.left||focus.cx);
  const placeRight=rightSpace>=240 || rightSpace>=leftSpace;
  const cx=placeRight?Math.min(W-86,(focus.right||focus.cx)+180):Math.max(86,(focus.left||focus.cx)-180);
  const gap=52;
  const start=focus.cy-((count-1)*gap)/2;
  return Array.from({length:count},(_,i)=>({cx,cy:Math.max(36,Math.min(graphH-36,start+i*gap))}));
}

function contextNodesForTask(){
  const t=tasks[currentTask];
  const target=(t.target||'').toLowerCase();
  if(target.includes('cystic fibrosis')){
    return ['CFTR dysfunction','thick dehydrated mucus','pancreatic insufficiency','steatorrhoea','PCD as distractor'];
  }
  if(target.includes('primary ciliary dyskinesia')){
    return ['ciliary motility defect','poor mucociliary clearance','neonatal respiratory distress','recurrent otitis media','no pancreatic insufficiency'];
  }
  if(target.includes('croup')){
    return ['viral URI prodrome','subglottic oedema','seal-bark cough','non-toxic appearance','epiglottitis / tracheitis distractors'];
  }
  return [];
}

function task3EvidenceIsRemoved(evidIds){
  if(currentTask!==3 || (tasks[3]||{}).regenerated) return false;
  return (evidIds||[]).some(id=>task3SelectedCluesToRemove.has(id));
}

function renderKG(){
  const t=tasks[currentTask];
  const kg=t.kgData;
  const board=document.getElementById('kgBoard');
  const isInteractive=((t.mode==='kg' || t.mode==='both') && kgExplainOpen);
  if(!explanationVisible){
    board.style.display='none';
    board.innerHTML='';
    document.getElementById('kgProvenanceNote').style.display='none';
    document.getElementById('kgExcludeWrap').style.display='none';
    document.getElementById('pathText').textContent='';
    document.getElementById('kgTextPanel').classList.remove('open');
    return;
  }

  if(t.mode==='text'){
    board.style.display='none';
    board.classList.remove('focus-active');
    board.innerHTML='';
    document.getElementById('kgProvenanceNote').style.display='none';
    document.getElementById('kgExcludeWrap').style.display='none';
    document.getElementById('pathText').textContent='';
    document.getElementById('kgTextPanel').classList.remove('open');
    return;
  }

  board.style.display='block';
  const provNote=document.getElementById('kgProvenanceNote');
  provNote.style.display='none';
  const llmProv=provNote.querySelector('.llm-prov');
  if(llmProv)llmProv.style.display=(t.mode==='both')?'inline-flex':'none';
  board.classList.toggle('focus-active',!!focusedKgNodeId);

  const visibleEvidence=(kg.evidence||[]).filter(ev=>!ev.hiddenInMain);
  const visibleFindings=(kg.findings||[]).filter(f=>!f.hiddenInMain && !task3EvidenceIsRemoved(f.from));
  const visiblePatterns=(kg.patterns||[]).filter(p=>!p.hiddenInMain);
  const visibleMechs=(kg.mechs||[]).filter(m=>!m.hiddenInMain);
  const W=1180,LEGEND_H=44;
  const cfCount=visibleFindings.length,pCount=visiblePatterns.length,mCount=visibleMechs.length;
  const NODE_H=52, GROUP_GAP=34;
  const totalBandH=Math.max(cfCount,1)*NODE_H + Math.max(cfCount-1,0)*GROUP_GAP;
  const graphH=Math.max(totalBandH+120, 360);
  const H=graphH+LEGEND_H;

  const SIDE_PAD=130;
  const colNames=['cf',...(pCount>0?['pattern']:[]),'mech','dx'];
  const colSpacing=(W-SIDE_PAD*2)/(colNames.length-1);
  const COL={};
  colNames.forEach((name,i)=>{ COL[name]=SIDE_PAD+i*colSpacing; });

  function ySpread(count,total,topMargin){
    topMargin=topMargin||60;
    if(count<=0)return[];
    const usable=total-topMargin*2;
    if(count===1)return[total/2];
    const step=usable/(count-1);
    return Array.from({length:count},(_,i)=>topMargin+i*step);
  }
  function clampY(y,margin=56){
    return Math.max(margin,Math.min(graphH-margin,y));
  }
  function avgKnown(ids,map,fallback){
    const vals=(ids||[]).map(id=>map[id]).filter(v=>Number.isFinite(v));
    if(!vals.length)return fallback;
    return vals.reduce((s,v)=>s+v,0)/vals.length;
  }

  const cfYSpread=ySpread(cfCount,graphH,70);
  const cfYMap={};
  visibleFindings.forEach((cf,fi)=>{ cfYMap[cf.id]=cfYSpread[fi]||graphH/2; });

  const pFallback=ySpread(pCount,graphH,60);
  const pYMap={};
  visiblePatterns.forEach((p,i)=>{
    const base=avgKnown(p.from,cfYMap,pFallback[i]||graphH/2);
    pYMap[p.id]=clampY(base+(pCount===1?8:(i%2?-14:14)));
  });
  const sourceYForMech=id=>pYMap[id]??cfYMap[id];
  const mFallback=ySpread(mCount,graphH,60);
  const mYMap={};
  visibleMechs.forEach((m,i)=>{
    const srcMap=Object.fromEntries([...(m.from||[])].map(id=>[id,sourceYForMech(id)]));
    const base=avgKnown(m.from,srcMap,mFallback[i]||graphH/2);
    const mechOffset=(currentTask===3 && m.id==='m1')?-28:(mCount===1?-18:(i%2?18:-18));
    mYMap[m.id]=clampY(base+mechOffset);
  });
  const dxSourceMap={...cfYMap,...pYMap,...mYMap};
  const dxBase=avgKnown(kg.dx.from,dxSourceMap,graphH/2);
  const dxY=[clampY(dxBase-8)];

  const nodeMap={};let nodesSvg='',edgesSvg='';
  const focusRelated=focusedKgNodeId?relatedIdsForFocus(kg,focusedKgNodeId):new Set();
  const focusNeighbors=focusedKgNodeId?directNeighborIdsForFocus(kg,focusedKgNodeId):new Set();
  const focusMeta=id=>({
    focused:focusedKgNodeId===id,
    neighbor:!!focusedKgNodeId && focusNeighbors.has(id) && focusedKgNodeId!==id,
    faded:!!focusedKgNodeId && focusedKgNodeId!==id && !focusNeighbors.has(id),
    selected:selectedGraphItem&&selectedGraphItem.type==='node'&&selectedGraphItem.id===id
  });
  const edgeMeta=(fromId,toId,kind,extra={})=>({
    ...extra,
    edgeId:edgeIdFor(fromId,toId,kind),
    fromId,toId,
    focused:!!focusedKgNodeId && (fromId===focusedKgNodeId || toId===focusedKgNodeId),
    neighbor:!!focusedKgNodeId && fromId!==focusedKgNodeId && toId!==focusedKgNodeId && (focusNeighbors.has(fromId) || focusNeighbors.has(toId)),
    selected:selectedGraphItem&&selectedGraphItem.type==='edge'&&selectedGraphItem.id===edgeIdFor(fromId,toId,kind)
  });

  visibleFindings.forEach((cf)=>{
    const evidIds=(cf.from||[]).filter(Boolean);
    const mergedMeta=evidIds.length?{evid:evidIds.join('|')}:{evid:cf.mergedEvidence||undefined};
    const canEditDelete=currentTask===3 && !((tasks[3]||{}).regenerated) && task3ClueEditMode && evidIds.some(id=>TASK3_CLUE_CANDIDATES.some(c=>c.id===id));
    const deleteSelected=evidIds.some(id=>task3SelectedCluesToRemove.has(id));
    const pos=getDraggableNodePosition(cf.id,COL.cf,cfYMap[cf.id]);
    const nodeMeta=isInteractive?{interactive:true,tooltip:cf.tooltip,tooltipTitle:semanticTypeLabel(cf,'finding'),showDeleteControl:canEditDelete,deleteSelected,...mergedMeta,...focusMeta(cf.id)}:{showDeleteControl:canEditDelete,deleteSelected,...mergedMeta,...focusMeta(cf.id)};
    const n=makeNode(cf.id,semanticTypeFor(cf,'finding'),cf.label,pos.cx,pos.cy,nodeMeta);
    nodeMap[cf.id]=n;nodesSvg+=n.svg;
  });
  visiblePatterns.forEach((p,i)=>{
    const pos=getDraggableNodePosition(p.id,COL.pattern,pYMap[p.id]);
    const n=makeNode(p.id,semanticTypeFor(p,'pattern'),p.label,pos.cx,pos.cy,
      isInteractive?{interactive:true,tooltip:p.tooltip,tooltipTitle:semanticTypeLabel(p,'pattern'),...focusMeta(p.id)}:focusMeta(p.id));
    nodeMap[p.id]=n;nodesSvg+=n.svg;
  });
  visibleMechs.forEach((m,i)=>{
    const pos=getDraggableNodePosition(m.id,COL.mech,mYMap[m.id]);
    const n=makeNode(m.id,semanticTypeFor(m,'mech'),m.label,pos.cx,pos.cy,
      isInteractive?{interactive:true,tooltip:m.tooltip,tooltipTitle:semanticTypeLabel(m,'mech'),...focusMeta(m.id)}:focusMeta(m.id));
    nodeMap[m.id]=n;nodesSvg+=n.svg;
  });
  const dxPos=getDraggableNodePosition(kg.dx.id,COL.dx,dxY[0]);
  const dxN=makeNode(kg.dx.id,semanticTypeFor(kg.dx,'dx'),kg.dx.label,dxPos.cx,dxPos.cy,
    isInteractive?{interactive:true,tooltip:kg.dx.tooltip,tooltipTitle:semanticTypeLabel(kg.dx,'dx'),...focusMeta(kg.dx.id)}:focusMeta(kg.dx.id));
  nodeMap[kg.dx.id]=dxN;nodesSvg+=dxN.svg;

  // finding → pattern
  visiblePatterns.forEach(p=>{
    (p.from||[]).forEach(cfId=>{
      if(!nodeMap[cfId]||!nodeMap[p.id])return;
      const relation='localizes_to';
      const sourceLabel=getFindingById(kg,cfId)?.label||cfId;
      const tooltip=isInteractive?`${relationSentence(sourceLabel,relation,p.label)} The LLM hover text explains why these separate findings should be grouped before moving to mechanism.`:null;
      const eid=edgeIdFor(cfId,p.id,relation);
      edgesSvg+=makeEdge(nodeMap[cfId],nodeMap[p.id],getEdgeLabel(eid,relation),'#7b4da0',
        isInteractive?edgeMeta(cfId,p.id,relation,{interactive:true,tooltip,tooltipTitle:relation}):edgeMeta(cfId,p.id,relation));
    });
  });
  // finding → mechanism
  visibleMechs.forEach(m=>{
    m.from.forEach(cfId=>{
      if(!nodeMap[cfId]||!nodeMap[m.id])return;
      const src=visibleFindings.find(f=>f.id===cfId)||visiblePatterns.find(p=>p.id===cfId);
      const defaultRelation=defaultFindingToMechanismRelation(src?src.label:cfId,m.label);
      const tooltip=isInteractive?`${relationSentence(src?src.label:cfId,defaultRelation,m.label)} ${m.tooltip||''}`:null;
      const eid=edgeIdFor(cfId,m.id,defaultRelation);
      edgesSvg+=makeEdge(nodeMap[cfId],nodeMap[m.id],getEdgeLabel(eid,defaultRelation),'#1a7a7a',
        isInteractive?edgeMeta(cfId,m.id,defaultRelation,{interactive:true,tooltip,tooltipTitle:defaultRelation}):edgeMeta(cfId,m.id,defaultRelation));
    });
  });
  // mechanism/finding → dx
  kg.dx.from.forEach(srcId=>{
    const src=nodeMap[srcId];
    if(!src)return;
    const record=getNodeRecord(kg,srcId);
    const node=record?.node;
    const defaultDxRelation=defaultDiagnosisRelation(record,kg.dx.label);
    const tooltip=isInteractive?`${relationSentence(node?node.label:srcId,defaultDxRelation,kg.dx.label)} ${kg.dx.tooltip||''}`:null;
    const eid=edgeIdFor(srcId,kg.dx.id,defaultDxRelation);
    edgesSvg+=makeEdge(src,nodeMap[kg.dx.id],getEdgeLabel(eid,defaultDxRelation),'#2d5f8a',
      isInteractive?edgeMeta(srcId,kg.dx.id,defaultDxRelation,{interactive:true,tooltip,tooltipTitle:defaultDxRelation,labelOffsetY:defaultDxRelation==='pathophysiology_of'?-12:null}):edgeMeta(srcId,kg.dx.id,defaultDxRelation,{labelOffsetY:defaultDxRelation==='pathophysiology_of'?-12:null}));
  });
  // Optional KG-internal edges, used when one mapped concept modifies another
  // rather than feeding directly into mechanism or diagnosis.
  (kg.extraEdges||[]).forEach(edge=>{
    const from=nodeMap[edge.from],to=nodeMap[edge.to];
    if(!from||!to)return;
    const relation=edge.relation||'associated_with';
    const eid=edgeIdFor(edge.from,edge.to,relation);
    const label=getEdgeLabel(eid,relation);
    const sourceLabel=getNodeRecord(kg,edge.from)?.node?.label||edge.from;
    const targetLabel=getNodeRecord(kg,edge.to)?.node?.label||edge.to;
    const tooltip=isInteractive?`${relationSentence(sourceLabel,label,targetLabel)} ${edge.tooltip||''}`:null;
    edgesSvg+=makeEdge(from,to,label,edge.color||'#6f6b62',
      isInteractive?edgeMeta(edge.from,edge.to,relation,{interactive:true,tooltip,tooltipTitle:label}):edgeMeta(edge.from,edge.to,relation));
  });

  const usedLegendTypes=Array.from(new Set([
    ...visibleFindings.map(n=>semanticTypeFor(n,'finding')),
    ...visiblePatterns.map(n=>semanticTypeFor(n,'pattern')),
    ...visibleMechs.map(n=>semanticTypeFor(n,'mech')),
    semanticTypeFor(kg.dx,'dx')
  ])).filter(Boolean);
  const legend=makeLegend(W,H,usedLegendTypes);
  // Add horizontal padding to viewBox so rightmost nodes are never clipped
  const VB_PAD=16;
  const svg=`<svg viewBox="${-VB_PAD} 0 ${W+VB_PAD*2} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;overflow:visible">
    <defs>
      <marker id="karrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
        <path d="M0,0 L9,4.5 L0,9 z" fill="#aaa"/>
      </marker>
    </defs>
    <rect x="${-VB_PAD}" width="${W+VB_PAD*2}" height="${H}" fill="white" rx="12"/>
    ${edgesSvg}
    ${nodesSvg}
    <line x1="16" y1="${graphH+1}" x2="${W-16}" y2="${graphH+1}" stroke="#e8e4dd" stroke-width="1"/>
    ${legend}
  </svg>`;

  board.innerHTML=svg;
  bindEvidenceInteractions();
  bindGraphNodeDragging();
  bindNodeInsightClicks();
  if(isInteractive) bindNodeEdgeTooltips();
  renderExcludeCards();
  const kgTextPanel=document.getElementById('kgTextPanel');
  kgTextPanel.classList.remove('open');
  document.getElementById('pathText').textContent='';
  renderGraphOverlayControls();
}


function toggleKgEnrichedText(force){
  if(currentTask!==2 && currentTask!==3)return;
  kgExplainOpen=(force===undefined)?!kgExplainOpen:!!force;
  hideTooltip();
  updateKgHint();
  updateTask3SupportSwitch();
  if(explanationVisible && !(currentTask===3 && task3SupportMode==='text')) renderKG();
}

function renderGraphOverlayControls(){
  const board=document.getElementById('kgBoard');
  if(!board)return;
  board.querySelectorAll('.graph-toolbar').forEach(el=>el.remove());
  if(!explanationVisible)return;
  if(currentTask===2){
    const div=document.createElement('div');
    div.className='graph-toolbar';
    div.innerHTML=`<button class="graph-toggle ${kgExplainOpen?'active':''}" onclick="toggleKgEnrichedText()" title="Toggle enriched hover text"><span class="graph-toggle-dot"></span> Enriched text</button>`;
    board.appendChild(div);
  }
  if(currentTask===3 && task3SupportMode!=='text'){
    const right=document.createElement('div');
    right.className='graph-toolbar';
    right.innerHTML=`
      <button class="graph-toggle ${kgExplainOpen?'active':''}" onclick="toggleKgEnrichedText()" title="Toggle enriched hover text"><span class="graph-toggle-dot"></span> Enriched text</button>
      <button class="graph-tool-btn ${task3ClueEditMode?'active':''}" id="task3ClueEditBtn" onclick="toggleTask3ClueEditMode()">${task3ClueEditMode?'Done editing':'Edit clues'}</button>
      <button class="graph-tool-btn danger" id="task3ResetBtn" onclick="requestResetCurrentTask()">Reset</button>`;
    board.appendChild(right);
  }
}

let pendingCustomConfirmAction=null;
function openCustomConfirm({title,body,list,confirmText,onConfirm}){
  const modal=document.getElementById('customConfirmModal');
  const titleEl=document.getElementById('customConfirmTitle');
  const bodyEl=document.getElementById('customConfirmBody');
  const listEl=document.getElementById('customConfirmList');
  const btn=document.getElementById('customConfirmPrimaryBtn');
  if(!modal||!titleEl||!bodyEl||!listEl||!btn)return;
  titleEl.textContent=title||'Confirm action';
  bodyEl.textContent=body||'';
  if(list){
    listEl.style.display='block';
    listEl.innerHTML=Array.isArray(list)?list.map(x=>`• ${esc(x)}`).join('<br>'):esc(list);
  } else {
    listEl.style.display='none';
    listEl.innerHTML='';
  }
  btn.textContent=confirmText||'Confirm';
  pendingCustomConfirmAction=typeof onConfirm==='function'?onConfirm:null;
  btn.onclick=()=>{
    const action=pendingCustomConfirmAction;
    closeCustomConfirm();
    if(action)action();
  };
  modal.classList.add('open');
}
function closeCustomConfirm(){
  const modal=document.getElementById('customConfirmModal');
  if(modal)modal.classList.remove('open');
  pendingCustomConfirmAction=null;
}
function requestResetCurrentTask(){
  openCustomConfirm({
    title:'Reset this task?',
    body:'This will restore the original version and remove regenerated content, clue selections, and manual edits for this task.',
    confirmText:'Reset',
    onConfirm:()=>resetCurrentTask(true)
  });
}
function requestClueDelete(evids){
  const anyUnselected=evids.some(id=>!task3SelectedCluesToRemove.has(id));
  if(!anyUnselected){
    evids.forEach(id=>task3SelectedCluesToRemove.delete(id));
    renderTask3CluePanel();
    renderCurrentVignette();
    renderKG();
    return;
  }
  const labels=TASK3_CLUE_CANDIDATES.filter(c=>evids.includes(c.id)).map(c=>c.label);
  openCustomConfirm({
    title:'Remove this clue?',
    body:'This will remove or weaken the selected clue in the knowledge graph and also update the vignette wording.',
    list:labels,
    confirmText:'Remove clue',
    onConfirm:()=>{
      evids.forEach(id=>task3SelectedCluesToRemove.add(id));
      renderTask3CluePanel();
      renderCurrentVignette();
      renderKG();
    }
  });
}

function bindNodeEdgeTooltips(){
  // Nodes with tooltip
  document.querySelectorAll('.kg-node.interactive-node[data-tooltip]').forEach(el=>{
    const title=el.getAttribute('data-tooltip-title')||'';
    const body=el.getAttribute('data-tooltip')||'';
    el.addEventListener('mouseenter',e=>showTooltip(e,title,body));
    el.addEventListener('mousemove',e=>moveTooltip(e));
    el.addEventListener('mouseleave',hideTooltip);
  });
  // Edges with tooltip
  document.querySelectorAll('.interactive-edge[data-tooltip]').forEach(el=>{
    const title=el.getAttribute('data-tooltip-title')||'';
    const body=el.getAttribute('data-tooltip')||'';
    el.addEventListener('mouseenter',e=>showTooltip(e,title,body));
    el.addEventListener('mousemove',e=>moveTooltip(e));
    el.addEventListener('mouseleave',hideTooltip);
  });
}

function miniEvidenceRationale(card,eid,role='against'){
  const t=tasks[currentTask];
  const ev=getEvidenceById(t.kgData,eid);
  const label=(ev?cleanLabel(ev.short||ev.label||ev.phrase):eid).toLowerCase();
  const target=(card.target||'').toLowerCase();
  if(role==='supports'){
    if(target.includes('epiglottitis')&&label.includes('stridor'))return 'Inspiratory stridor makes epiglottitis a plausible airway-emergency distractor.';
    if(target.includes('bacterial tracheitis')&&label.includes('uri'))return 'A viral URI prodrome can precede secondary bacterial tracheitis, so it supports initial plausibility before severity clues are checked.';
    if(target.includes('bacterial tracheitis')&&label.includes('stridor'))return 'Stridor can occur in bacterial tracheitis, so this evidence supports initial plausibility before severity clues are checked.';
    if(target.includes('foreign body')&&label.includes('stridor'))return 'Sudden noisy breathing/stridor can be seen with foreign body aspiration, making it a plausible distractor.';
    if(target.includes('retropharyngeal')&&label.includes('hoarse'))return 'Voice change can occur with deep neck or upper-airway processes, so hoarseness keeps retropharyngeal abscess plausible before the expected pattern is checked.';
    if(target.includes('retropharyngeal')&&(label.includes('uri')||label.includes('fever')))return 'Fever/airway symptoms can make a deep neck infection plausible, but the localization clues argue against retropharyngeal abscess.';
    if(target.includes('primary ciliary dyskinesia')&&(label.includes('pneumonia')||label.includes('wet')))return 'Recurrent pneumonia and chronic wet cough support PCD plausibility because PCD impairs mucociliary clearance.';
    if(target.includes('humoral')&&label.includes('pneumonia'))return 'Recurrent pneumonia supports humoral immunodeficiency as a plausible distractor because antibody defects cause recurrent sinopulmonary infection.';
    if(target.includes('gastroesophageal')&&label.includes('pneumonia'))return 'Recurrent pneumonia supports aspiration from GERD as a plausible distractor.';
    if(target.includes('asthma')&&label.includes('wet'))return 'Chronic cough can make asthma plausible at first glance, although the broader pattern argues against uncomplicated asthma.';
    return `This vignette evidence makes ${card.target} initially plausible.`;
  }

  if(target.includes('epiglottitis')){
    if(label.includes('seal'))return 'Barky cough localizes to subglottic/laryngeal inflammation, whereas epiglottitis is supraglottic and classically has muffled voice rather than a bark.';
    if(label.includes('non-toxic'))return 'A playful, non-toxic child is unlike epiglottitis, which typically presents as an acutely ill child with high fever and distress.';
    if(label.includes('swallow'))return 'Normal swallowing argues strongly against epiglottitis, where dysphagia and drooling are central red flags.';
  }
  if(target.includes('bacterial tracheitis')){
    if(label.includes('low'))return 'Low-grade fever fits uncomplicated viral croup better than bacterial tracheitis, which usually causes high fever and rapid deterioration.';
    if(label.includes('non-toxic'))return 'Non-toxic appearance is the key contrast: bacterial tracheitis generally looks much sicker with toxic appearance and purulent airway secretions.';
  }
  if(target.includes('foreign body')){
    if(label.includes('uri')||label.includes('low'))return 'A feverish viral prodrome points to infection; foreign body aspiration usually follows a choking episode and lacks URI symptoms.';
  }
  if(target.includes('retropharyngeal')){
    if(label.includes('seal'))return 'Barky cough points to laryngotracheal/subglottic involvement, not a posterior pharyngeal space infection.';
    if(label.includes('hoarse'))return 'Hoarseness implies laryngeal/vocal cord involvement; retropharyngeal abscess more often causes muffled voice.';
    if(label.includes('swallow'))return 'Normal swallowing weakens retropharyngeal abscess, which usually causes dysphagia, neck stiffness, or refusal to move the neck.';
  }
  if(target.includes('primary ciliary dyskinesia')){
    if(label.includes('pneumonia'))return 'Recurrent pneumonia keeps PCD plausible, but it is not enough once strong pancreatic malabsorption clues are present.';
    if(label.includes('wet'))return 'Wet cough fits PCD, but PCD would not explain the parallel gastrointestinal malabsorption pattern in this case.';
    if(label.includes('poor weight'))return 'Poor weight gain despite intake points to malabsorption, which is not explained by isolated ciliary dyskinesia.';
    if(label.includes('greasy'))return 'Greasy stools are steatorrhoea, indicating pancreatic exocrine insufficiency; PCD does not affect the pancreas.';
  }
  if(target.includes('humoral')){
    if(label.includes('greasy'))return 'Steatorrhoea is organ-specific malabsorption, not an antibody-production problem.';
    if(label.includes('poor weight'))return 'Failure to thrive despite eating well points to nutrient malabsorption rather than immune deficiency alone.';
    if(label.includes('clubbing'))return 'Early clubbing suggests chronic suppurative lung disease rather than isolated recurrent infections from antibody deficiency.';
  }
  if(target.includes('gastroesophageal')){
    if(label.includes('pneumonia'))return 'Aspiration can explain recurrent pneumonia, so GERD remains plausible on respiratory grounds.';
    if(label.includes('poor weight'))return 'The weight problem is paired with fatty stools, so it is better explained by malabsorption than reflux-related feeding avoidance.';
    if(label.includes('greasy'))return 'GERD does not cause bulky fatty stools; this clue requires pancreatic or intestinal malabsorption.';
  }
  if(target.includes('asthma')){
    if(label.includes('greasy'))return 'Asthma cannot explain steatorrhoea; the gastrointestinal clue points outside a purely airway-reactive disorder.';
    if(label.includes('pneumonia'))return 'Recurrent bacterial pneumonia suggests impaired clearance or immune/exocrine disease rather than ordinary asthma.';
    if(label.includes('clubbing'))return 'Digital clubbing is a red flag for chronic suppurative lung disease and is not typical of uncomplicated asthma.';
  }
  return `This evidence contributes to ruling out ${card.target}.`;
}

function miniNodeSvg({x,y,label,type='evidence',cls='',attrs='',maxW=112,minW=74,font=9.5,dashed=false,dragKey='',cardIndex=0}){
  const c=type==='distractor'
    ? {fill:'#eef2f6',stroke:'#667085',text:'#26313f'}
    : type==='expected'
      ? {fill:'#fff8e7',stroke:'#b48600',text:'#5f4a08'}
      : type==='against'
        ? {fill:'#fff1f1',stroke:'#9b2d2d',text:'#6c2020'}
      : {fill:'#edf7f2',stroke:'#1a6b3c',text:'#174a2d'};
  const clean=cleanLabel(label);
  const w=Math.max(minW,Math.min(maxW,textWidthEstimate(clean,font)+18));
  const maxChars=Math.max(8,Math.floor((w-14)/(font*0.58)));
  const lines=wrapText(clean,maxChars).slice(0,type==='expected'?3:2);
  const h=type==='expected'?(lines.length>2?50:(lines.length>1?38:30)):(lines.length>1?38:30);
  const off=dragKey?getMiniDragOffset(cardIndex,dragKey):{x:0,y:0};
  x=x+(off.x||0); y=y+(off.y||0);
  const dragAttrs=dragKey?` data-mini-card="${cardIndex}" data-mini-node="${esc(dragKey)}" data-base-x="${x-(off.x||0)}" data-base-y="${y-(off.y||0)}" data-dx="${off.x||0}" data-dy="${off.y||0}"`:'';
  let s=`<g class="${cls} mini-draggable-node" ${attrs}${dragAttrs}>`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" ${dashed?'stroke-dasharray="5 3"':''}/>`;
  lines.forEach((line,i)=>{
    const ty=y+(lines.length===1?23:24+i*11);
    s+=`<text x="${x+w/2}" y="${ty}" text-anchor="middle" font-size="${font}" font-weight="850" fill="${c.text}" font-family="DM Sans,sans-serif">${esc(line)}</text>`;
  });
  s+='</g>';
  return {svg:s,w,h,cx:x+w/2,cy:y+h/2,right:x+w,left:x};
}

function miniEvidenceLayout(count){
  if(count<=1)return[{x:82,y:18}];
  if(count===2)return[{x:46,y:18},{x:166,y:18}];
  return[{x:18,y:18},{x:110,y:18},{x:202,y:18}];
}
function miniRoleLayout(role,count){
  if(role==='supports'){
    if(count<=1)return[{x:18,y:16}];
    return[{x:18,y:10},{x:18,y:48}];
  }
  if(count<=1)return[{x:18,y:96}];
  if(count===2)return[{x:18,y:82},{x:18,y:122}];
  return[{x:18,y:74},{x:18,y:114},{x:18,y:154}];
}

function renderExcludeCards(){
  const t=tasks[currentTask];
  const wrap=document.getElementById('kgExcludeWrap');
  const box=document.getElementById('kgExcludeCards');
  const rawCards=(t.kgData&&t.kgData.excludeCards)||[];
  const cards=(t.distractors||[]).map(d=>{
    const found=rawCards.find(c=>cleanLabel(c.target).toLowerCase()===cleanLabel(d.disease).toLowerCase());
    return found||{target:d.disease,focus:[],explanation:d.incorrect||''};
  });
  if(!explanationVisible||!cards.length||t.mode==='text'){wrap.style.display='none';box.innerHTML='';return;}
  wrap.style.display='block';
  const hint=document.getElementById('miniGraphHint');
  if(hint)hint.textContent=t.mode==='both'
    ? 'Green = explicit evidence supports plausibility; red = explicit evidence argues against; dashed = expected but not established.'
    : 'Green = supports plausibility; red = argues against; dashed = expected but not established.';
  box.innerHTML=cards.map((c,i)=>{
    const supportIds=[...(c.supports||[])].slice(0,2);
    const againstIds=[...(c.against||c.focus||[])].filter(id=>!supportIds.includes(id)).slice(0,3);
    const focus=[...new Set([...supportIds,...againstIds,...(c.focus||[])])];
    const hasExpected=!!c.expected;
    const makeEvItems=(ids,role)=>ids.map((eid,j)=>{
      const ev=getEvidenceById(t.kgData,eid);
      const label=ev?ev.short||cleanLabel(ev.label):eid;
      const {x,y}=miniRoleLayout(role,ids.length)[j];
      const title=(role==='supports'?'Supports plausibility: ':'Argues against: ')+label;
      const node=miniNodeSvg({x,y,label,type:role==='against'?'against':'evidence',cls:'mini-evidence-node',attrs:`data-evid="${esc(eid)}" data-role="${esc(role)}" data-explanation="${esc(miniEvidenceRationale(c,eid,role))}" data-title="${esc(title)}"`,maxW:92,minW:70,font:8.4,dragKey:`${role}-${eid}`,cardIndex:i});
      return {eid,node,role};
    });
    const supportItems=makeEvItems(supportIds,'supports');
    const againstItems=makeEvItems(againstIds,'against');
    const evItems=[...supportItems,...againstItems];
    const evidenceNodes=evItems.map(x=>x.node.svg).join('');
    const expected=hasExpected
      ? miniNodeSvg({x:170,y:162,label:c.expected,type:'expected',dashed:true,cls:'mini-expected-node',attrs:`data-explanation="${esc(c.expectedExplanation||'Expected distractor pattern is not established by this vignette.')}" data-title="${esc('Expected but not established: '+cleanLabel(c.expected))}"`,maxW:118,minW:96,font:8.2,dragKey:'expected',cardIndex:i})
      : null;
    const dist=miniNodeSvg({x:hasExpected?318:104,y:hasExpected?88:76,label:c.target,type:'distractor',cls:'mini-distractor-node',attrs:`data-explanation="${esc(c.explanation||'')}" data-title="${esc('Distractor: '+c.target)}"`,maxW:hasExpected?88:112,minW:76,font:8.2,dragKey:'distractor',cardIndex:i});
    const softCurve=(from,targetY,color,marker,opts={})=>{
      const midX=opts.midX||246;
      const entryX=dist.left;
      const dash=opts.dash?'stroke-dasharray="4 3"':'';
      return `<path d="M${from.right},${from.cy} C${midX},${from.cy} ${midX},${targetY} ${entryX},${targetY}" fill="none" stroke="${color}" stroke-width="${opts.width||1.45}" ${dash} marker-end="url(#${marker}${i})"/>`;
    };
    const supportTargetYs=supportItems.map((_,idx)=>dist.cy-13+(idx-(supportItems.length-1)/2)*7);
    const againstTargetYs=againstItems.map((_,idx)=>dist.cy+6+(idx-(againstItems.length-1)/2)*9);
    const edgeLines=hasExpected
      ? supportItems.map(({node},idx)=>softCurve(node,supportTargetYs[idx],'#1a6b3c','miniArrowGreen',{midX:246,width:1.45})).join('')
        + againstItems.map(({node},idx)=>softCurve(node,againstTargetYs[idx],'#8a2d2d','miniArrowRed',{midX:248,width:1.45})).join('')
        + softCurve(expected,dist.cy+22,'#9b8f84','miniArrowDash',{midX:292,width:1.25,dash:true})
      : evItems.map(({node,role})=>`<path d="M${node.cx},${node.cy+20} C${node.cx},66 ${dist.cx},62 ${dist.cx},${dist.cy-18}" fill="none" stroke="${role==='supports'?'#1a6b3c':'#8a2d2d'}" stroke-width="1.35" marker-end="url(#miniArrow${role==='supports'?'Green':'Red'}${i})"/>`).join('');
    const midLabels=hasExpected
      ? `<rect x="222" y="21" width="56" height="16" rx="8" fill="white" opacity=".97"/>
         <text x="250" y="33" text-anchor="middle" font-size="8.4" font-weight="900" fill="#1a6b3c" font-family="DM Sans,sans-serif">supports</text>
         <rect x="211" y="83" width="82" height="16" rx="8" fill="white" opacity=".97"/>
         <text x="252" y="95" text-anchor="middle" font-size="8.4" font-weight="900" fill="#8a2d2d" font-family="DM Sans,sans-serif">argues_against</text>
         <rect x="280" y="183" width="72" height="16" rx="8" fill="white" opacity=".97"/>
         <text x="316" y="195" text-anchor="middle" font-size="8.4" font-weight="900" fill="#7a6a5a" font-family="DM Sans,sans-serif">expected_in</text>`
      : `<rect x="96" y="58" width="108" height="18" rx="9" fill="white" opacity=".94"/>
         <text x="150" y="71" text-anchor="middle" font-size="10" font-weight="900" fill="#8a2d2d" font-family="DM Sans,sans-serif">argues against</text>`;
    return`<div class="mini-distractor-card" data-focus='${JSON.stringify(focus)}' data-explanation="${esc(c.explanation||'')}" data-target="${esc(c.target)}">
      <div class="mini-distractor-head"><div class="mini-distractor-title">${esc(c.target)}</div><div class="mini-distractor-chip">excluded</div></div>
      <svg class="mini-distractor-svg" viewBox="0 0 ${hasExpected?418:300} ${hasExpected?216:118}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="miniArrowGreen${i}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1a6b3c"/></marker>
          <marker id="miniArrowRed${i}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#8a2d2d"/></marker>
          <marker id="miniArrowDash${i}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#9b8f84"/></marker>
        </defs>
        ${evidenceNodes}
        ${edgeLines}
        ${midLabels}
        ${expected?expected.svg:''}
        ${dist.svg}
      </svg>
    </div>`;
  }).join('');

  document.querySelectorAll('.mini-distractor-card').forEach(card=>{
    const focus=JSON.parse(card.getAttribute('data-focus')||'[]');
    const explanation=card.getAttribute('data-explanation')||'';
    const targetText=card.getAttribute('data-target')||'Distractor';
    card.addEventListener('click',()=>{if(suppressNextMiniClick){suppressNextMiniClick=false;return;} hideTooltip();scrollToVignette(focus);});
  });
  document.querySelectorAll('.mini-evidence-node[data-evid]').forEach(node=>{
    const evid=node.getAttribute('data-evid');
    const explanation=node.getAttribute('data-explanation')||'';
    const title=node.getAttribute('data-title')||'Evidence';
    node.addEventListener('mouseenter',e=>{
      setLinkedEvidenceState(evid,true);
      if(kgExplainOpen&&explanation)showTooltip(e,title,explanation);
    });
    node.addEventListener('mousemove',e=>{if(kgExplainOpen&&explanation)moveTooltip(e);});
    node.addEventListener('mouseleave',()=>{setLinkedEvidenceState(evid,false);hideTooltip();});
    node.addEventListener('click',(e)=>{e.stopPropagation();scrollToVignette([evid]);});
  });
  document.querySelectorAll('.mini-expected-node[data-explanation]').forEach(node=>{
    const explanation=node.getAttribute('data-explanation')||'';
    const title=node.getAttribute('data-title')||'Expected pattern';
    if(kgExplainOpen&&explanation){
      node.addEventListener('mouseenter',e=>showTooltip(e,title,explanation));
      node.addEventListener('mousemove',e=>moveTooltip(e));
      node.addEventListener('mouseleave',hideTooltip);
    }
  });
  document.querySelectorAll('.mini-distractor-node[data-explanation]').forEach(node=>{
    const explanation=node.getAttribute('data-explanation')||'';
    const title=node.getAttribute('data-title')||'Distractor';
    if(kgExplainOpen&&explanation){
      node.addEventListener('mouseenter',e=>showTooltip(e,title,explanation));
      node.addEventListener('mousemove',e=>moveTooltip(e));
      node.addEventListener('mouseleave',hideTooltip);
    }
  });
  bindMiniGraphDragging();
}

function bindMiniGraphDragging(){
  document.querySelectorAll('.mini-draggable-node[data-mini-node]').forEach(node=>{
    node.addEventListener('mousedown',e=>{
      e.stopPropagation();
      hideTooltip();
      const svg=node.closest('svg');
      if(!svg)return;
      const pt=svg.createSVGPoint();
      pt.x=e.clientX; pt.y=e.clientY;
      const local=pt.matrixTransform(svg.getScreenCTM().inverse());
      activeMiniDrag={
        card:Number(node.getAttribute('data-mini-card')||0),
        id:node.getAttribute('data-mini-node'),
        startX:local.x,
        startY:local.y,
        startDx:Number(node.getAttribute('data-dx')||0),
        startDy:Number(node.getAttribute('data-dy')||0),
        moved:false
      };
      node.classList.add('dragging');
    });
  });
}
document.addEventListener('mousemove',e=>{
  if(!activeMiniDrag)return;
  const svg=document.querySelector(`.mini-draggable-node[data-mini-card="${activeMiniDrag.card}"][data-mini-node="${CSS.escape(activeMiniDrag.id)}"]`)?.closest('svg');
  if(!svg)return;
  const pt=svg.createSVGPoint();
  pt.x=e.clientX; pt.y=e.clientY;
  const local=pt.matrixTransform(svg.getScreenCTM().inverse());
  const dx=activeMiniDrag.startDx+(local.x-activeMiniDrag.startX);
  const dy=activeMiniDrag.startDy+(local.y-activeMiniDrag.startY);
  if(Math.abs(dx-activeMiniDrag.startDx)>2 || Math.abs(dy-activeMiniDrag.startDy)>2){
    activeMiniDrag.moved=true;
    suppressNextMiniClick=true;
  }
  setMiniDragOffset(activeMiniDrag.card,activeMiniDrag.id,dx,dy);
  renderExcludeCards();
});
document.addEventListener('mouseup',()=>{
  if(activeMiniDrag){
    activeMiniDrag=null;
    document.querySelectorAll('.mini-draggable-node.dragging').forEach(n=>n.classList.remove('dragging'));
    setTimeout(()=>{suppressNextMiniClick=false;},80);
  }
});

function handleExcludeClick(card,focus){
  hideTooltip();
  scrollToVignette(focus);
}



function renderTask3CluePanel(){
  const t=tasks[currentTask]||{};
  const show=currentTask===3 && !t.regenerated;
  const sub=document.getElementById('task3SupportSub');
  if(sub && currentTask===3){
    if(show){
      sub.textContent = task3ClueEditMode
        ? 'Clue edit mode is on. Use the small × on clue nodes to confirm which clues should be removed or weakened before regeneration.'
        : 'Turn on clue edit mode, then use the small × on clue nodes to confirm whether they should be removed or weakened before regeneration.';
    } else {
      sub.textContent = 'Regenerated version loaded. You can compare it using text, KG, or KG + enriched text.';
    }
  }
  const btn=document.getElementById('task3ClueEditBtn');
  if(btn){
    btn.textContent=task3ClueEditMode?'Done editing':'Edit clues';
    btn.classList.toggle('active',task3ClueEditMode);
  }
  const resetBtn=document.getElementById('task3ResetBtn');
  if(resetBtn) resetBtn.style.display = currentTask===3 ? 'inline-flex' : 'none';
  updateSelectedClueHighlights();
}

function toggleTask3ClueRemoval(id,checked){
  if(checked)task3SelectedCluesToRemove.add(id); else task3SelectedCluesToRemove.delete(id);
  renderTask3CluePanel();
  renderCurrentVignette();
  if(currentTask===3 && explanationVisible && task3SupportMode!=='text') renderKG();
}

function toggleTask3ClueEditMode(force){
  const next=(force===undefined)?!task3ClueEditMode:!!force;
  task3ClueEditMode=next;
  renderTask3CluePanel();
  if(currentTask===3 && explanationVisible && task3SupportMode!=='text') renderKG();
}

function updateSelectedClueHighlights(){
  document.querySelectorAll('.hl-core[data-evid]').forEach(el=>{
    el.classList.toggle('remove-selected',task3SelectedCluesToRemove.has(el.dataset.evid));
  });
  document.querySelectorAll('.kg-node[data-evid]').forEach(el=>{
    const evids=(el.dataset.evid||'').split('|').filter(Boolean);
    const anySelected=evids.some(id=>task3SelectedCluesToRemove.has(id));
    const eligible=evids.some(id=>TASK3_CLUE_CANDIDATES.some(c=>c.id===id));
    el.classList.toggle('task3-clue-node', currentTask===3 && !(tasks[3]||{}).regenerated && eligible);
    el.classList.toggle('task3-remove-selected', anySelected);
  });
}


function updateSelectedClueSummary(){
  const box=document.getElementById('selectedClueSummary');
  if(!box)return;
  const selected=TASK3_CLUE_CANDIDATES.filter(c=>task3SelectedCluesToRemove.has(c.id));
  if(!selected.length){
    box.innerHTML='No clue nodes are selected yet. Click clue nodes in the graph if you want the regeneration request to reflect specific removals or weakenings.';
    return;
  }
  box.innerHTML=`Selected clues to remove/weaken:<br>${selected.map(c=>`• ${esc(c.label)}`).join('<br>')}`;
}

function updateRegenerationIssueDefaults(){
  const modal=document.getElementById('regenerateModal');
  if(!modal)return;
  const selectedIds=[...task3SelectedCluesToRemove];
  const checks=modal.querySelectorAll('input[type="checkbox"][value]');
  checks.forEach(input=>{
    if(input.value==='too_much_evidence') input.checked=selectedIds.length>=3;
    if(input.value==='answer_named') input.checked=selectedIds.includes('ev_named')||selectedIds.includes('ev_parent');
    if(input.value==='too_obvious') input.checked=selectedIds.includes('ev_named')||selectedIds.includes('ev_parent')||selectedIds.includes('ev_bark');
    if(input.value==='weak_distractors') input.checked=selectedIds.includes('ev_swallow')||selectedIds.includes('ev_well');
  });
  updateSelectedClueSummary();
}


function updateTask3SupportSwitch(){
  const sw=document.getElementById('task3SupportSwitch');
  if(!sw)return;
  const isTask3=currentTask===3 && explanationVisible;
  sw.style.display=isTask3?'flex':'none';
  if(!isTask3)return;
  const sub=document.getElementById('task3SupportSub');
  const t=tasks[currentTask]||{};
  if(sub){
    sub.textContent=t.regenerated
      ? 'Regenerated version: choose text or KG support. Enriched hover text is controlled inside the KG.'
      : 'Flawed version: choose text or KG support. Edit clues directly inside the graph before regeneration.';
  }
  const textBtn=document.getElementById('supportModeText');
  const kgBtn=document.getElementById('supportModeKg');
  if(textBtn) textBtn.classList.toggle('active',task3SupportMode==='text');
  if(kgBtn) kgBtn.classList.toggle('active',task3SupportMode!=='text');
  const chip=document.getElementById('navChip');
  if(chip){
    const label=task3SupportMode==='text'?'Text':(kgExplainOpen?'KG + enriched text':'KG');
    const prefix=(tasks[currentTask]&&tasks[currentTask].regenerated)?'Regenerated':'Flawed item';
    chip.textContent=`${prefix} · ${label}`;
  }
  renderGraphOverlayControls();
}

function setTask3SupportMode(mode){
  task3SupportMode=(mode==='text')?'text':'kg';
  applyTask3SupportMode(true);
}

function applyTask3SupportMode(shouldRender=true){
  if(currentTask!==3)return;
  const kgBoard=document.getElementById('kgBoard');
  const exclude=document.getElementById('kgExcludeWrap');
  const path=document.getElementById('pathText');
  const rightPanel=document.getElementById('rightTextPanel');
  const rightBody=document.getElementById('rightTextBody');
  const rightHead=rightPanel?rightPanel.querySelector('.right-text-panel-head'):null;
  const kgHeaderBtn=document.getElementById('kgHeaderExplainBtn');
  const kgTextPanel=document.getElementById('kgTextPanel');
  hideTooltip();
  updateTask3SupportSwitch();

  if(task3SupportMode==='text'){
    kgExplainOpen=false;
    if(kgBoard){kgBoard.style.display='none';kgBoard.innerHTML='<div class="kg-disabled-msg">Text-only support is selected. Switch to KG to view the knowledge graph.</div>';}
    if(exclude)exclude.style.display='none';
    if(path)path.style.display='none';
    if(kgTextPanel)kgTextPanel.classList.remove('open');
    if(rightPanel)rightPanel.style.display='block';
    if(rightHead)rightHead.style.display='none';
    if(rightBody)rightBody.classList.add('open');
    renderTextExplanation();
    const explainBtn=document.getElementById('explainBtn');
    if(explainBtn){explainBtn.textContent='Hide explanation ↑';explainBtn.classList.add('active');}
    if(kgHeaderBtn)kgHeaderBtn.style.display='flex';
  } else {
    kgExplainOpen=!!kgExplainOpen;
    if(rightPanel)rightPanel.style.display='none';
    if(path)path.style.display='block';
    if(kgHeaderBtn)kgHeaderBtn.style.display='flex';
    if(kgBoard)kgBoard.style.display='block';
    if(shouldRender)renderKG();
  }
  updateKgHint();
}

function renderActions(){
  const actions=document.getElementById('actionsSection');
  if(!actions)return;
  const t=tasks[currentTask];
  const isTask3=currentTask===3;
  const isRegenerated=!!(t&&t.regenerated);
  if(isTask3 && !isRegenerated){
    actions.innerHTML=`
      <button class="btn reject" onclick="openRegenerate()">Regenerate</button>
      <button class="btn edit-btn" onclick="toggleEdit()" id="editBtn">Revise</button>
      <button class="btn accept" onclick="acceptQuestion()">Accept &amp; Save</button>
    `;
  } else if(isTask3 && isRegenerated){
    actions.innerHTML=`
      <button class="btn edit-btn" onclick="toggleEdit()" id="editBtn">Revise this version</button>
      <button class="btn accept" onclick="acceptQuestion()">Accept &amp; Save</button>
      <button class="btn reject" onclick="openReject()">Reject</button>
    `;
  } else {
    actions.innerHTML=`
      <button class="btn accept" onclick="acceptQuestion()">Accept &amp; Save</button>
      <button class="btn reject" onclick="openReject()">Reject</button>
      <button class="btn edit-btn" onclick="toggleEdit()" id="editBtn">Revise</button>
    `;
  }
}

function openRegenerate(){
  updateRegenerationIssueDefaults();
  const modal=document.getElementById('regenerateModal');
  if(modal)modal.classList.add('open');
}
function closeRegenerate(){
  const modal=document.getElementById('regenerateModal');
  if(modal)modal.classList.remove('open');
}
function resetCurrentTask(skipConfirm=false){
  if(!skipConfirm){ requestResetCurrentTask(); return; }
  tasks[currentTask]=JSON.parse(JSON.stringify(originalTasks[currentTask]));
  revisedTasks.delete(currentTask);
  if(currentTask===3){
    task3Regenerated=false;
    task3SupportMode='kg';
    task3SelectedCluesToRemove=new Set();
    task3ClueEditMode=false;
  }
  hideExplanationAfterLoad=true;
  focusedKgNodeId=null;
  selectedGraphItem=null;
  toggleEdit(false);
  loadTask(currentTask);
  showToast('Task reset to the original version. Explanation is hidden until you show it again.');
}
function applyRegenerate(){
  try{
    task3Regenerated=true;
    const removedClues=[...task3SelectedCluesToRemove];
    tasks[3]=JSON.parse(JSON.stringify(task3ImprovedTemplate));
    tasks[3].removed_clues=removedClues;
    task3ClueEditMode=false;
    closeRegenerate();
    // Keep the same Task 3 support mode selected by the expert, but hide explanation for independent review.
    hideExplanationAfterLoad=true;
    loadTask(3);
    updateTask3SupportSwitch();
    applyTask3SupportMode(true);
    const n=removedClues.length;
    showToast(n?`Regenerated version loaded with ${n} selected clue(s) removed or weakened.`:'Regenerated version loaded. You can inspect it with Text, KG, or KG + enriched text.');
  }catch(err){
    console.error(err);
    alert('Regeneration failed: '+(err&&err.message?err.message:err));
  }
}

// ══════════════════════════════════════════════════════════════
// ACCEPT / BANK / REJECT
// ══════════════════════════════════════════════════════════════
function acceptQuestion(){
  const bank=JSON.parse(localStorage.getItem('resp_mcq_bank')||'[]');
  const t=tasks[currentTask];
  bank.push({target:t.target,question_stem:t.question_stem,correct:t.correct,options:t.options,source:t.source,saved_at:new Date().toISOString()});
  localStorage.setItem('resp_mcq_bank',JSON.stringify(bank));
  renderBank();
  showToast('Accepted and saved to question bank');
}
function openBank(){renderBank();document.getElementById('bankModal').classList.add('open');}
function closeBank(){document.getElementById('bankModal').classList.remove('open');}
function renderBank(){
  const list=document.getElementById('bankList');
  const count=document.getElementById('navBankCount');
  const bank=JSON.parse(localStorage.getItem('resp_mcq_bank')||'[]');
  if(count)count.textContent=bank.length;
  if(list){
    if(!bank.length)list.innerHTML='<div class="study-note">No accepted questions yet.</div>';
    else list.innerHTML=bank.map((q,i)=>`<div class="bank-card"><h4>${i+1}. ${esc(q.target)}</h4><p><strong>Stem:</strong> ${esc(q.question_stem)}</p><p><strong>Correct:</strong> ${esc(q.correct)}. ${esc(q.options[q.correct])}</p><p><strong>Source:</strong> ${esc(q.source)}</p><div class="bank-actions"><button class="btn reject" onclick="deleteFromBank(${i})">Delete</button></div></div>`).join('');
  }
}
function deleteFromBank(i){const bank=JSON.parse(localStorage.getItem('resp_mcq_bank')||'[]');bank.splice(i,1);localStorage.setItem('resp_mcq_bank',JSON.stringify(bank));renderBank();showToast('Deleted from bank');}
function openReject(){document.getElementById('rejectModal').classList.add('open');}
function closeReject(){document.getElementById('rejectModal').classList.remove('open');}
function submitReject(){closeReject();showToast('Feedback submitted');}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2200);}



Object.assign(window, {
  selectDiff,
  selectMode,
  startStudy,
  goSetup,
  openPicker,
  closePicker,
  renderPicker,
  selectPicker,
  filterPicker,
  confirmPicker,
  applySemanticEvidenceTypes,
  esc,
  escReg,
  persistReviewState,
  dragOffsetKey,
  getDraggableNodePosition,
  setDraggableNodeOffset,
  miniDragKey,
  getMiniDragOffset,
  setMiniDragOffset,
  getDragBaseFromElement,
  getEvidenceHighlights,
  getTaskDisplayVignette,
  highlight,
  renderCurrentVignette,
  setLinkedEvidenceState,
  scrollToVignette,
  bindEvidenceInteractions,
  cleanTooltipText,
  prettyTooltipTitle,
  showTooltip,
  moveTooltip,
  hideTooltip,
  loadTask,
  updateKgHint,
  renderOptions,
  toggleTextExplain,
  renderTextExplanation,
  renderKgTextExplanation,
  isCurrentTaskRevised,
  updateTextExplainControl,
  toggleHeaderExplain,
  updateKgExplainControl,
  toggleKgExplain,
  applyExplanationVisibility,
  toggleEdit,
  autoGrowEditTextareas,
  saveEdits,
  semanticTypeFor,
  semanticTypeLabel,
  wrapText,
  textWidthEstimate,
  makeNode,
  makeEdge,
  makeLegend,
  cleanLabel,
  getNodeTypeLabel,
  getEvidenceById,
  getFindingById,
  getMechanismById,
  getPatternById,
  getNodeRecord,
  evidencePhrasesForNode,
  relatedKnowledgeForCurrentTask,
  roleTextForNode,
  renderNodeInsightPanel,
  renderEvidenceCoverage,
  renderExpertReviewPanel,
  selectReviewStatus,
  applyGraphReviewEdit,
  renderKgUnderstandingPanels,
  bindGraphNodeDragging,
  bindNodeInsightClicks,
  relatedIdsForFocus,
  directNeighborIdsForFocus,
  contextLabelsForFocusedNode,
  contextRelationForFocusedNode,
  contextTooltipForFocusedNode,
  graphReviewKey,
  getReviewRecord,
  setReviewRecord,
  statusClass,
  statusLabel,
  edgeIdFor,
  getEdgeLabel,
  setEdgeLabel,
  currentKg,
  getNodeDisplayLabel,
  updateNodeDisplayLabel,
  relationProvenance,
  defaultFindingToMechanismRelation,
  defaultEvidenceToFindingRelation,
  defaultDiagnosisRelation,
  relationSentence,
  contextBubblePositions,
  contextNodesForTask,
  task3EvidenceIsRemoved,
  renderKG,
  toggleKgEnrichedText,
  renderGraphOverlayControls,
  openCustomConfirm,
  closeCustomConfirm,
  requestResetCurrentTask,
  requestClueDelete,
  bindNodeEdgeTooltips,
  miniEvidenceRationale,
  miniNodeSvg,
  miniEvidenceLayout,
  miniRoleLayout,
  renderExcludeCards,
  bindMiniGraphDragging,
  handleExcludeClick,
  renderTask3CluePanel,
  toggleTask3ClueRemoval,
  toggleTask3ClueEditMode,
  updateSelectedClueHighlights,
  updateSelectedClueSummary,
  updateRegenerationIssueDefaults,
  updateTask3SupportSwitch,
  setTask3SupportMode,
  applyTask3SupportMode,
  renderActions,
  openRegenerate,
  closeRegenerate,
  resetCurrentTask,
  applyRegenerate,
  acceptQuestion,
  openBank,
  closeBank,
  renderBank,
  deleteFromBank,
  openReject,
  closeReject,
  submitReject,
  showToast
});

renderBank();
})();
