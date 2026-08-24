document.querySelectorAll('a[href^="#"]').forEach(function(l){
  l.addEventListener('click',function(e){
    var t=document.getElementById(this.getAttribute('href').slice(1));
    if(!t)return; e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// reveal-on-scroll, shared by all variants
(function(){
  var io=new IntersectionObserver(function(en){
    en.forEach(function(x){ if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);} });
  },{threshold:.12});
  document.querySelectorAll('.role,.proof-cell,.chapter-row,.section-head,.quote-panel,.press-feature,.membership-grid>*').forEach(function(el,i){
    el.classList.add('reveal'); el.style.setProperty('--d',(i%8)*60+'ms'); io.observe(el);
  });
})();

(function(){var h=document.querySelector('.hero');
 for(var i=0;i<26;i++){var s=document.createElement('div');s.className='star';
  s.style.left=(Math.random()*98)+'%';s.style.top=(Math.random()*92)+'%';
  s.style.background=['#00F0FF','#FF2D95','#FFE93D','#EDEBFF'][i%4];
  s.style.animationDelay=(Math.random()*2.4).toFixed(2)+'s';h.appendChild(s);}
 var c=document.createElement('div');c.className='coin';c.textContent='INSERT COIN';h.appendChild(c);
 var hs=document.createElement('div');hs.className='hiscore';hs.innerHTML='HI-SCORE<br>012400';h.appendChild(hs);})();

// membership application form -> Formspree
(function(){
  var form=document.getElementById('membership-form');
  if(!form) return;
  var status=document.getElementById('membership-form-status');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    status.className='login-success';
    status.textContent='Sending...';
    fetch(form.action,{
      method:'POST',
      body:data,
      headers:{'Accept':'application/json'}
    }).then(function(res){
      if(res.ok){
        form.reset();
        status.textContent='Application received — check your email for confirmation.';
        status.classList.add('show');
      } else {
        return res.json().then(function(data){
          status.textContent=(data && data.errors) ? data.errors.map(function(er){return er.message;}).join(', ') : 'Something went wrong — please try again.';
          status.classList.add('show');
        });
      }
    }).catch(function(){
      status.textContent='Something went wrong — please try again.';
      status.classList.add('show');
    });
  });
})();
