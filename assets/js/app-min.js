const miModulo = (() => {
  'use strict'
  let a = []
  const e = ['C', 'H', 'D', 'S'],
    t = ['A', 'J', 'Q', 'K']
  let n = [],
    s = 0,
    i = 0,
    c = 0,
    o = 0,
    d = 0,
    l = ''
  const r = document.querySelector('#btn-pedir'),
    m = document.querySelector('#btn-detener'),
    u = document.querySelector('#btn-nuevo'),
    f = document.querySelectorAll('small'),
    p = document.querySelectorAll('.div-cartas'),
    h = document.getElementById('jugador-cartas'),
    w = document.getElementById('casa-cartas'),
    g = document.querySelector('#div-deck'),
    b =
      (document.querySelector('.deck'),
      async (e = 2) => {
        ;(a = await k()), (n = [])
        for (let a = 0; a < e; a++) n.push(0)
        ;(o = n.length - 1),
          (d = n.length - 2),
          f.forEach(a => (a.innerText = 0)),
          p.forEach(a => (a.innerHTML = '')),
          (r.disabled = !1),
          (m.disabled = !1),
          y(),
          L(),
          await D(),
          setTimeout(async () => {
            await C()
          }, 600)
      }),
    y = () => {
      const a = document.createElement('img')
      a.classList.add('carta-deck'),
        (a.src = 'assets/cartas/grey_back.png'),
        g.append(a)
    },
    L = () => {
      const a = document.querySelector('.carta-deck')
      a.classList.add('animate__animated', 'animate__fadeOutUpBig'), g.append(a)
    },
    k = () => {
      a = []
      for (let t = 2; t <= 10; t++) for (let n of e) a.push(t + n)
      for (let n of e) for (let e of t) a.push(e + n)
      return _.shuffle(a)
    },
    E = () => {
      if (0 === a.length) throw 'No hay cartas en la baraja'
      return a.pop()
    },
    S = (a, e, t = !0) => (
      (n[e] =
        n[e] +
        (a => {
          const e = a.substring(0, a.length - 1)
          return isNaN(e) ? ('A' === e ? 11 : 10) : 1 * e
        })(a)),
      setTimeout(() => {
        t && (f[e].innerText = n[e])
      }, 500),
      n[e]
    ),
    T = async () => {
      f[d].innerText = n[d]
    },
    v = async (a, e, t = !1) => {
      const n = document.createElement('img')
      n.classList.add(
        'carta',
        'carta-mostrada',
        'animate__animated',
        'animate__fadeInDownBig'
      ),
        t && 0 == e && n.classList.add('carta-l'),
        (n.src = `assets/cartas/${a}.png`),
        p[e].append(n)
    }
  async function q () {
    const a = document.querySelector('.front'),
      e = document.querySelector('.back')
    ;(e.src = `assets/cartas/${l}.png`),
      a.classList.add('front-turn'),
      e.classList.add('back-turn')
  }
  const B = async () => {
      const [a, e] = n
      setTimeout(() => {
        e === a && $('Nadie gana', 'Empate'),
          e > 21 && $('Uups...', 'Perdiste'),
          a > 21 && e <= 21 && $('Grandioso', 'Ganaste'),
          a > e && a <= 21 && $('Uups...', 'Perdiste')
      }, 1500)
    },
    C = async (a = !1, e = !1, t = !0) => {
      let n = a,
        o = t
      L()
      const r = await E()
      ;(s = S(r, d, o)),
        2 == i.length && e
          ? ((a, e) => {
              const t = [
                  'carta',
                  'carta-oculta',
                  'animate__animated',
                  'animate__fadeInDownBig'
                ],
                n = document.createElement('img'),
                s = document.createElement('img')
              n.classList.add(...t),
                n.classList.add('back'),
                s.classList.add(...t),
                s.classList.add('front'),
                (l = a),
                (s.src = 'assets/cartas/grey_back.png'),
                p[e].append(n, s),
                setTimeout(() => {
                  n.classList.remove('animate__animated'),
                    n.classList.remove('animate__fadeInDownBig'),
                    s.classList.remove('animate__animated'),
                    s.classList.remove('animate__fadeInDownBig')
                }, 1e3)
            })(r, d)
          : n
          ? v(r, d, n)
          : v(r, d),
        (c = w.children)
    }
  function I (a) {
    return new Promise(e => {
      setTimeout(() => {
        e()
      }, a)
    })
  }
  const x = async (a, e = !1) => {
      if (n[o] >= n[d] && n[o] <= 21 && 21 != n[d]) {
        do {
          if ((await I(700), await C(e), 21 == s)) break
        } while (s <= a && a <= 21)
      } else await T()
      await B()
    },
    D = async () => {
      let a = !1
      const e = await E(),
        t = await S(e, o)
      await v(e, o),
        (i = h.children),
        2 == i.length &&
          ((m.disabled = !1),
          setTimeout(async () => {
            await C(!1, !0, !1)
          }, 500)),
        i.length < 2
          ? (m.disabled = !0)
          : ((r.disabled = !0),
            (m.disabled = !0),
            setTimeout(() => {
              a || ((r.disabled = !1), (m.disabled = !1))
            }, 1800)),
        t > 21
          ? ((a = !0),
            (r.disabled = !0),
            (m.disabled = !0),
            await q(),
            await T(),
            await B())
          : 21 === t &&
            ((a = !0),
            (r.disabled = !0),
            (m.disabled = !0),
            setTimeout(async () => {
              await q(), await x(t, !0)
            }, 700))
    },
    $ = (a, e) => {
      let t = a,
        n = e,
        s = ''
      ;(s =
        'Ganaste' == e
          ? '\n     <span class="icon-alert-color">\n        <i class="fa-solid fa-child-reaching fa-4x fa-bounce"></i>\n     </span> \n    '
          : 'Perdiste' == e
          ? '\n      <span class="icon-alert-color">\n        <i class="fa-solid fa-skull fa-4x fa-fade"></i>\n      </span> \n   '
          : '\n      <span class="icon-alert-color">\n        <i class="fa-solid fa-handshake fa-4x animate__animated animate__shakeY"></i>\n      </span>'),
        Swal.fire({
          title: `<p class="title-alert">${t}!</p>`,
          backdrop: '#272727a1',
          customClass: { popup: 'border-alert' },
          html: `\n        <h2 class="message">\n         <b>${n}</b>\n        </h2>\n        <p class="mt-5">\n         ${s}\n        </p>\n      `,
          showCloseButton: !0,
          showCancelButton: !1,
          focusConfirm: !1,
          showConfirmButton: !1,
          showClass: {
            popup:
              '\n          animate__animated\n          animate__fadeInUp\n          animate__faster\n        '
          },
          hideClass: {
            popup:
              '\n          animate__animated\n          animate__fadeOutDown\n          animate__faster\n        '
          }
        })
    }
  return (
    r.addEventListener('click', function () {
      y(), L(), D()
    }),
    m.addEventListener('click', async function () {
      ;(r.disabled = !0),
        (m.disabled = !0),
        c.length > 1 && (await q()),
        await x(n[o], !0)
    }),
    u.addEventListener('click', function () {
      console.clear(), b()
    }),
    { nuevoJuego: b }
  )
})()
