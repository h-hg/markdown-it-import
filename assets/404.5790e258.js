import{f as i,u as d,g as p,o as f,c as k,d as e,t as c,a as v,w as g,h as l,r as L,e as x,_ as B}from"../app.cd6d049e.mjs";const N={class:"theme-container"},T={class:"page"},C={class:"theme-default-content"},M=e("h1",null,"404",-1),R=i({__name:"404",setup(V){var s,a,n;const _=d(),o=p(),t=(s=o.value.notFound)!=null?s:["Not Found"],u=()=>t[Math.floor(Math.random()*t.length)],r=(a=o.value.home)!=null?a:_.value,m=(n=o.value.backToHome)!=null?n:"Back to home";return(b,w)=>{const h=L("RouterLink");return f(),k("div",N,[e("main",T,[e("div",C,[M,e("blockquote",null,c(u()),1),v(h,{to:l(r)},{default:g(()=>[x(c(l(m)),1)]),_:1},8,["to"])])])])}}}),F=B(R,[["__file","404.vue"]]);export{F as default};