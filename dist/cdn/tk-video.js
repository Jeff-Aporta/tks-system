import{blockCss as l,crearBloque as n,define as s,html as r}from"./_shared.js";const d="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.3/src/lite-yt-embed.js",c=`
  ${l}

  /* Copia de lite-yt-embed.css (0.3.3), con el marco y el tope de ancho
     del visor: a pantalla completa el video se com\xEDa la columna. */
  lite-youtube {
    position: relative;
    display: block;
    contain: content;
    box-sizing: border-box;
    width: 100%;
    max-width: min(100%, var(--tk-video-max, 45rem));
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background-color: #000;
    background-position: center center;
    background-size: cover;
    cursor: pointer;
  }
  lite-youtube::before {
    content: attr(data-title);
    display: block;
    position: absolute;
    top: 0;
    background-image: linear-gradient(180deg, rgb(0 0 0 / 67%) 0%, rgb(0 0 0 / 54%) 14%, rgb(0 0 0 / 15%) 54%, rgb(0 0 0 / 5%) 72%, rgb(0 0 0 / 0%) 94%);
    height: 99px;
    width: 100%;
    font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
    color: hsl(0deg 0% 93.33%);
    text-shadow: 0 0 2px rgb(0 0 0 / 50%);
    font-size: 1rem;
    padding: 1.25rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  lite-youtube:hover::before { color: #fff; }
  lite-youtube > iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  lite-youtube > .lty-playbtn {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: no-repeat center/68px 48px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
    cursor: pointer;
    z-index: 1;
    filter: grayscale(100%);
    transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
    border: 0;
  }
  lite-youtube:hover > .lty-playbtn,
  lite-youtube .lty-playbtn:focus { filter: none; }
  lite-youtube.lyt-activated { cursor: unset; }
  lite-youtube.lyt-activated::before,
  lite-youtube.lyt-activated > .lty-playbtn {
    opacity: 0;
    pointer-events: none;
  }
  .lyt-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;
    clip-path: inset(50%);
  }
`,u=/^[a-zA-Z0-9_-]{6,20}$/;let a=!1;const b=()=>{if(a||customElements.get("lite-youtube"))return;a=!0;const e=document.createElement("script");e.src=d,e.async=!0,document.head.append(e)};s("tk-video",n(c,(e,t)=>{const o=String(t.youtubeid??t.youtubeId??"").trim();if(!u.test(o))return;b();const i=`Reproducir: ${String(t.title??"video")}`;e.append(r`
    <lite-youtube videoid="${o}" params="rel=0&amp;modestbranding=1" playlabel="${i}">
      <a
        class="lty-playbtn"
        href="https://www.youtube.com/watch?v=${o}"
        target="_blank"
        rel="noopener noreferrer"
      ><span class="lyt-visually-hidden">${i}</span></a>
    </lite-youtube>
    ${t.caption&&r`<p class="pie">${t.caption}</p>`}
  `)}));
