"use strict";
(self.webpackChunkapp = self.webpackChunkapp || []).push([
  [179],
  {
    311: () => {
      function Ee(n) {
        return "function" == typeof n;
      }
      function So(n) {
        const t = n((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (t.prototype = Object.create(Error.prototype)),
          (t.prototype.constructor = t),
          t
        );
      }
      const Da = So(
        (n) =>
          function (t) {
            n(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = t);
          }
      );
      function Mo(n, e) {
        if (n) {
          const t = n.indexOf(e);
          0 <= t && n.splice(t, 1);
        }
      }
      class qt {
        constructor(e) {
          (this.initialTeardown = e),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let e;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t)))
                for (const o of t) o.remove(this);
              else t.remove(this);
            const { initialTeardown: r } = this;
            if (Ee(r))
              try {
                r();
              } catch (o) {
                e = o instanceof Da ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Np(o);
                } catch (s) {
                  (e = e ?? []),
                    s instanceof Da ? (e = [...e, ...s.errors]) : e.push(s);
                }
            }
            if (e) throw new Da(e);
          }
        }
        add(e) {
          var t;
          if (e && e !== this)
            if (this.closed) Np(e);
            else {
              if (e instanceof qt) {
                if (e.closed || e._hasParent(this)) return;
                e._addParent(this);
              }
              (this._finalizers =
                null !== (t = this._finalizers) && void 0 !== t ? t : []).push(
                e
              );
            }
        }
        _hasParent(e) {
          const { _parentage: t } = this;
          return t === e || (Array.isArray(t) && t.includes(e));
        }
        _addParent(e) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
        }
        _removeParent(e) {
          const { _parentage: t } = this;
          t === e ? (this._parentage = null) : Array.isArray(t) && Mo(t, e);
        }
        remove(e) {
          const { _finalizers: t } = this;
          t && Mo(t, e), e instanceof qt && e._removeParent(this);
        }
      }
      qt.EMPTY = (() => {
        const n = new qt();
        return (n.closed = !0), n;
      })();
      const xp = qt.EMPTY;
      function Rp(n) {
        return (
          n instanceof qt ||
          (n && "closed" in n && Ee(n.remove) && Ee(n.add) && Ee(n.unsubscribe))
        );
      }
      function Np(n) {
        Ee(n) ? n() : n.unsubscribe();
      }
      const Ur = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ba = {
          setTimeout(n, e, ...t) {
            const { delegate: r } = ba;
            return r?.setTimeout
              ? r.setTimeout(n, e, ...t)
              : setTimeout(n, e, ...t);
          },
          clearTimeout(n) {
            const { delegate: e } = ba;
            return (e?.clearTimeout || clearTimeout)(n);
          },
          delegate: void 0,
        };
      function Fp(n) {
        ba.setTimeout(() => {
          const { onUnhandledError: e } = Ur;
          if (!e) throw n;
          e(n);
        });
      }
      function Pp() {}
      const rw = Yu("C", void 0, void 0);
      function Yu(n, e, t) {
        return { kind: n, value: e, error: t };
      }
      let Br = null;
      function Ea(n) {
        if (Ur.useDeprecatedSynchronousErrorHandling) {
          const e = !Br;
          if ((e && (Br = { errorThrown: !1, error: null }), n(), e)) {
            const { errorThrown: t, error: r } = Br;
            if (((Br = null), t)) throw r;
          }
        } else n();
      }
      class Xu extends qt {
        constructor(e) {
          super(),
            (this.isStopped = !1),
            e
              ? ((this.destination = e), Rp(e) && e.add(this))
              : (this.destination = cw);
        }
        static create(e, t, r) {
          return new To(e, t, r);
        }
        next(e) {
          this.isStopped
            ? Ju(
                (function ow(n) {
                  return Yu("N", n, void 0);
                })(e),
                this
              )
            : this._next(e);
        }
        error(e) {
          this.isStopped
            ? Ju(
                (function iw(n) {
                  return Yu("E", void 0, n);
                })(e),
                this
              )
            : ((this.isStopped = !0), this._error(e));
        }
        complete() {
          this.isStopped
            ? Ju(rw, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(e) {
          this.destination.next(e);
        }
        _error(e) {
          try {
            this.destination.error(e);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const aw = Function.prototype.bind;
      function Zu(n, e) {
        return aw.call(n, e);
      }
      class lw {
        constructor(e) {
          this.partialObserver = e;
        }
        next(e) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(e);
            } catch (r) {
              wa(r);
            }
        }
        error(e) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(e);
            } catch (r) {
              wa(r);
            }
          else wa(e);
        }
        complete() {
          const { partialObserver: e } = this;
          if (e.complete)
            try {
              e.complete();
            } catch (t) {
              wa(t);
            }
        }
      }
      class To extends Xu {
        constructor(e, t, r) {
          let i;
          if ((super(), Ee(e) || !e))
            i = {
              next: e ?? void 0,
              error: t ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let o;
            this && Ur.useDeprecatedNextContext
              ? ((o = Object.create(e)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: e.next && Zu(e.next, o),
                  error: e.error && Zu(e.error, o),
                  complete: e.complete && Zu(e.complete, o),
                }))
              : (i = e);
          }
          this.destination = new lw(i);
        }
      }
      function wa(n) {
        Ur.useDeprecatedSynchronousErrorHandling
          ? (function sw(n) {
              Ur.useDeprecatedSynchronousErrorHandling &&
                Br &&
                ((Br.errorThrown = !0), (Br.error = n));
            })(n)
          : Fp(n);
      }
      function Ju(n, e) {
        const { onStoppedNotification: t } = Ur;
        t && ba.setTimeout(() => t(n, e));
      }
      const cw = {
          closed: !0,
          next: Pp,
          error: function uw(n) {
            throw n;
          },
          complete: Pp,
        },
        ec =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function jr(n) {
        return n;
      }
      function kp(n) {
        return 0 === n.length
          ? jr
          : 1 === n.length
          ? n[0]
          : function (t) {
              return n.reduce((r, i) => i(r), t);
            };
      }
      let Ue = (() => {
        class n {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const r = new n();
            return (r.source = this), (r.operator = t), r;
          }
          subscribe(t, r, i) {
            const o = (function hw(n) {
              return (
                (n && n instanceof Xu) ||
                ((function fw(n) {
                  return n && Ee(n.next) && Ee(n.error) && Ee(n.complete);
                })(n) &&
                  Rp(n))
              );
            })(t)
              ? t
              : new To(t, r, i);
            return (
              Ea(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (r) {
              t.error(r);
            }
          }
          forEach(t, r) {
            return new (r = Op(r))((i, o) => {
              const s = new To({
                next: (a) => {
                  try {
                    t(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(t);
          }
          [ec]() {
            return this;
          }
          pipe(...t) {
            return kp(t)(this);
          }
          toPromise(t) {
            return new (t = Op(t))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (n.create = (e) => new n(e)), n;
      })();
      function Op(n) {
        var e;
        return null !== (e = n ?? Ur.Promise) && void 0 !== e ? e : Promise;
      }
      const pw = So(
        (n) =>
          function () {
            n(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Nt = (() => {
        class n extends Ue {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const r = new Lp(this, this);
            return (r.operator = t), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new pw();
          }
          next(t) {
            Ea(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(t);
              }
            });
          }
          error(t) {
            Ea(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(t);
              }
            });
          }
          complete() {
            Ea(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (
              (null === (t = this.observers) || void 0 === t
                ? void 0
                : t.length) > 0
            );
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(t),
              this._innerSubscribe(t)
            );
          }
          _innerSubscribe(t) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? xp
              : ((this.currentObservers = null),
                o.push(t),
                new qt(() => {
                  (this.currentObservers = null), Mo(o, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? t.error(i) : o && t.complete();
          }
          asObservable() {
            const t = new Ue();
            return (t.source = this), t;
          }
        }
        return (n.create = (e, t) => new Lp(e, t)), n;
      })();
      class Lp extends Nt {
        constructor(e, t) {
          super(), (this.destination = e), (this.source = t);
        }
        next(e) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.next) ||
            void 0 === r ||
            r.call(t, e);
        }
        error(e) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.error) ||
            void 0 === r ||
            r.call(t, e);
        }
        complete() {
          var e, t;
          null ===
            (t =
              null === (e = this.destination) || void 0 === e
                ? void 0
                : e.complete) ||
            void 0 === t ||
            t.call(e);
        }
        _subscribe(e) {
          var t, r;
          return null !==
            (r =
              null === (t = this.source) || void 0 === t
                ? void 0
                : t.subscribe(e)) && void 0 !== r
            ? r
            : xp;
        }
      }
      function Vp(n) {
        return Ee(n?.lift);
      }
      function tt(n) {
        return (e) => {
          if (Vp(e))
            return e.lift(function (t) {
              try {
                return n(t, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Ye(n, e, t, r, i) {
        return new gw(n, e, t, r, i);
      }
      class gw extends Xu {
        constructor(e, t, r, i, o, s) {
          super(e),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (l) {
                    e.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    e.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    e.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var e;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(),
              !t &&
                (null === (e = this.onFinalize) ||
                  void 0 === e ||
                  e.call(this));
          }
        }
      }
      function re(n, e) {
        return tt((t, r) => {
          let i = 0;
          t.subscribe(
            Ye(r, (o) => {
              r.next(n.call(e, o, i++));
            })
          );
        });
      }
      function Hr(n) {
        return this instanceof Hr ? ((this.v = n), this) : new Hr(n);
      }
      function yw(n, e, t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var i,
          r = t.apply(n, e || []),
          o = [];
        return (
          (i = {}),
          s("next"),
          s("throw"),
          s("return"),
          (i[Symbol.asyncIterator] = function () {
            return this;
          }),
          i
        );
        function s(p) {
          r[p] &&
            (i[p] = function (g) {
              return new Promise(function (m, C) {
                o.push([p, g, m, C]) > 1 || a(p, g);
              });
            });
        }
        function a(p, g) {
          try {
            !(function l(p) {
              p.value instanceof Hr
                ? Promise.resolve(p.value.v).then(u, c)
                : d(o[0][2], p);
            })(r[p](g));
          } catch (m) {
            d(o[0][3], m);
          }
        }
        function u(p) {
          a("next", p);
        }
        function c(p) {
          a("throw", p);
        }
        function d(p, g) {
          p(g), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      }
      function vw(n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          e = n[Symbol.asyncIterator];
        return e
          ? e.call(n)
          : ((n = (function Bp(n) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                t = e && n[e],
                r = 0;
              if (t) return t.call(n);
              if (n && "number" == typeof n.length)
                return {
                  next: function () {
                    return (
                      n && r >= n.length && (n = void 0),
                      { value: n && n[r++], done: !n }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(n)),
            (t = {}),
            r("next"),
            r("throw"),
            r("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(o) {
          t[o] =
            n[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    o({ value: u, done: a });
                  }, s);
                })(a, l, (s = n[o](s)).done, s.value);
              });
            };
        }
      }
      const jp = (n) =>
        n && "number" == typeof n.length && "function" != typeof n;
      function Hp(n) {
        return Ee(n?.then);
      }
      function Gp(n) {
        return Ee(n[ec]);
      }
      function zp(n) {
        return Symbol.asyncIterator && Ee(n?.[Symbol.asyncIterator]);
      }
      function qp(n) {
        return new TypeError(
          `You provided ${
            null !== n && "object" == typeof n ? "an invalid object" : `'${n}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Wp = (function Dw() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Kp(n) {
        return Ee(n?.[Wp]);
      }
      function Qp(n) {
        return yw(this, arguments, function* () {
          const t = n.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield Hr(t.read());
              if (i) return yield Hr(void 0);
              yield yield Hr(r);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function Yp(n) {
        return Ee(n?.getReader);
      }
      function dn(n) {
        if (n instanceof Ue) return n;
        if (null != n) {
          if (Gp(n))
            return (function bw(n) {
              return new Ue((e) => {
                const t = n[ec]();
                if (Ee(t.subscribe)) return t.subscribe(e);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(n);
          if (jp(n))
            return (function Ew(n) {
              return new Ue((e) => {
                for (let t = 0; t < n.length && !e.closed; t++) e.next(n[t]);
                e.complete();
              });
            })(n);
          if (Hp(n))
            return (function ww(n) {
              return new Ue((e) => {
                n.then(
                  (t) => {
                    e.closed || (e.next(t), e.complete());
                  },
                  (t) => e.error(t)
                ).then(null, Fp);
              });
            })(n);
          if (zp(n)) return Xp(n);
          if (Kp(n))
            return (function Sw(n) {
              return new Ue((e) => {
                for (const t of n) if ((e.next(t), e.closed)) return;
                e.complete();
              });
            })(n);
          if (Yp(n))
            return (function Mw(n) {
              return Xp(Qp(n));
            })(n);
        }
        throw qp(n);
      }
      function Xp(n) {
        return new Ue((e) => {
          (function Tw(n, e) {
            var t, r, i, o;
            return (function mw(n, e, t, r) {
              return new (t || (t = Promise))(function (o, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? o(c.value)
                    : (function i(o) {
                        return o instanceof t
                          ? o
                          : new t(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(n, e || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = vw(n); !(r = yield t.next()).done; )
                  if ((e.next(r.value), e.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = t.return) && (yield o.call(t));
                } finally {
                  if (i) throw i.error;
                }
              }
              e.complete();
            });
          })(n, e).catch((t) => e.error(t));
        });
      }
      function Qn(n, e, t, r = 0, i = !1) {
        const o = e.schedule(function () {
          t(), i ? n.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((n.add(o), !i)) return o;
      }
      function rt(n, e, t = 1 / 0) {
        return Ee(e)
          ? rt((r, i) => re((o, s) => e(r, o, i, s))(dn(n(r, i))), t)
          : ("number" == typeof e && (t = e),
            tt((r, i) =>
              (function Iw(n, e, t, r, i, o, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const p = () => {
                    d && !l.length && !u && e.complete();
                  },
                  g = (C) => (u < r ? m(C) : l.push(C)),
                  m = (C) => {
                    o && e.next(C), u++;
                    let E = !1;
                    dn(t(C, c++)).subscribe(
                      Ye(
                        e,
                        (w) => {
                          i?.(w), o ? g(w) : e.next(w);
                        },
                        () => {
                          E = !0;
                        },
                        void 0,
                        () => {
                          if (E)
                            try {
                              for (u--; l.length && u < r; ) {
                                const w = l.shift();
                                s ? Qn(e, s, () => m(w)) : m(w);
                              }
                              p();
                            } catch (w) {
                              e.error(w);
                            }
                        }
                      )
                    );
                  };
                return (
                  n.subscribe(
                    Ye(e, g, () => {
                      (d = !0), p();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, n, t)
            ));
      }
      function _i(n = 1 / 0) {
        return rt(jr, n);
      }
      const In = new Ue((n) => n.complete());
      function nc(n) {
        return n[n.length - 1];
      }
      function Zp(n) {
        return Ee(nc(n)) ? n.pop() : void 0;
      }
      function Io(n) {
        return (function xw(n) {
          return n && Ee(n.schedule);
        })(nc(n))
          ? n.pop()
          : void 0;
      }
      function Jp(n, e = 0) {
        return tt((t, r) => {
          t.subscribe(
            Ye(
              r,
              (i) => Qn(r, n, () => r.next(i), e),
              () => Qn(r, n, () => r.complete(), e),
              (i) => Qn(r, n, () => r.error(i), e)
            )
          );
        });
      }
      function eg(n, e = 0) {
        return tt((t, r) => {
          r.add(n.schedule(() => t.subscribe(r), e));
        });
      }
      function tg(n, e) {
        if (!n) throw new Error("Iterable cannot be null");
        return new Ue((t) => {
          Qn(t, e, () => {
            const r = n[Symbol.asyncIterator]();
            Qn(
              t,
              e,
              () => {
                r.next().then((i) => {
                  i.done ? t.complete() : t.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Be(n, e) {
        return e
          ? (function Lw(n, e) {
              if (null != n) {
                if (Gp(n))
                  return (function Nw(n, e) {
                    return dn(n).pipe(eg(e), Jp(e));
                  })(n, e);
                if (jp(n))
                  return (function Pw(n, e) {
                    return new Ue((t) => {
                      let r = 0;
                      return e.schedule(function () {
                        r === n.length
                          ? t.complete()
                          : (t.next(n[r++]), t.closed || this.schedule());
                      });
                    });
                  })(n, e);
                if (Hp(n))
                  return (function Fw(n, e) {
                    return dn(n).pipe(eg(e), Jp(e));
                  })(n, e);
                if (zp(n)) return tg(n, e);
                if (Kp(n))
                  return (function kw(n, e) {
                    return new Ue((t) => {
                      let r;
                      return (
                        Qn(t, e, () => {
                          (r = n[Wp]()),
                            Qn(
                              t,
                              e,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                o ? t.complete() : t.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => Ee(r?.return) && r.return()
                      );
                    });
                  })(n, e);
                if (Yp(n))
                  return (function Ow(n, e) {
                    return tg(Qp(n), e);
                  })(n, e);
              }
              throw qp(n);
            })(n, e)
          : dn(n);
      }
      function rc(n, e, ...t) {
        if (!0 === e) return void n();
        if (!1 === e) return;
        const r = new To({
          next: () => {
            r.unsubscribe(), n();
          },
        });
        return e(...t).subscribe(r);
      }
      function De(n) {
        for (let e in n) if (n[e] === De) return e;
        throw Error("Could not find renamed property on target object.");
      }
      function ic(n, e) {
        for (const t in e)
          e.hasOwnProperty(t) && !n.hasOwnProperty(t) && (n[t] = e[t]);
      }
      function we(n) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) return "[" + n.map(we).join(", ") + "]";
        if (null == n) return "" + n;
        if (n.overriddenName) return `${n.overriddenName}`;
        if (n.name) return `${n.name}`;
        const e = n.toString();
        if (null == e) return "" + e;
        const t = e.indexOf("\n");
        return -1 === t ? e : e.substring(0, t);
      }
      function oc(n, e) {
        return null == n || "" === n
          ? null === e
            ? ""
            : e
          : null == e || "" === e
          ? n
          : n + " " + e;
      }
      const Uw = De({ __forward_ref__: De });
      function Se(n) {
        return (
          (n.__forward_ref__ = Se),
          (n.toString = function () {
            return we(this());
          }),
          n
        );
      }
      function z(n) {
        return sc(n) ? n() : n;
      }
      function sc(n) {
        return (
          "function" == typeof n &&
          n.hasOwnProperty(Uw) &&
          n.__forward_ref__ === Se
        );
      }
      function ac(n) {
        return n && !!n.ɵproviders;
      }
      const ng = "https://g.co/ng/security#xss";
      class T extends Error {
        constructor(e, t) {
          super(
            (function Sa(n, e) {
              return `NG0${Math.abs(n)}${e ? ": " + e.trim() : ""}`;
            })(e, t)
          ),
            (this.code = e);
        }
      }
      function X(n) {
        return "string" == typeof n ? n : null == n ? "" : String(n);
      }
      function Ma(n, e) {
        throw new T(-201, !1);
      }
      function Wt(n, e) {
        null == n &&
          (function _e(n, e, t, r) {
            throw new Error(
              `ASSERTION ERROR: ${n}` +
                (null == r ? "" : ` [Expected=> ${t} ${r} ${e} <=Actual]`)
            );
          })(e, n, null, "!=");
      }
      function O(n) {
        return {
          token: n.token,
          providedIn: n.providedIn || null,
          factory: n.factory,
          value: void 0,
        };
      }
      function Pt(n) {
        return { providers: n.providers || [], imports: n.imports || [] };
      }
      function Ta(n) {
        return rg(n, Ia) || rg(n, og);
      }
      function rg(n, e) {
        return n.hasOwnProperty(e) ? n[e] : null;
      }
      function ig(n) {
        return n && (n.hasOwnProperty(lc) || n.hasOwnProperty(Qw))
          ? n[lc]
          : null;
      }
      const Ia = De({ ɵprov: De }),
        lc = De({ ɵinj: De }),
        og = De({ ngInjectableDef: De }),
        Qw = De({ ngInjectorDef: De });
      var q = (() => (
        ((q = q || {})[(q.Default = 0)] = "Default"),
        (q[(q.Host = 1)] = "Host"),
        (q[(q.Self = 2)] = "Self"),
        (q[(q.SkipSelf = 4)] = "SkipSelf"),
        (q[(q.Optional = 8)] = "Optional"),
        q
      ))();
      let uc;
      function Kt(n) {
        const e = uc;
        return (uc = n), e;
      }
      function sg(n, e, t) {
        const r = Ta(n);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : t & q.Optional
          ? null
          : void 0 !== e
          ? e
          : void Ma(we(n));
      }
      const Me = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        Ao = {},
        cc = "__NG_DI_FLAG__",
        Aa = "ngTempTokenPath",
        Zw = /\n/gm,
        ag = "__source";
      let xo;
      function yi(n) {
        const e = xo;
        return (xo = n), e;
      }
      function eS(n, e = q.Default) {
        if (void 0 === xo) throw new T(-203, !1);
        return null === xo
          ? sg(n, void 0, e)
          : xo.get(n, e & q.Optional ? null : void 0, e);
      }
      function N(n, e = q.Default) {
        return (
          (function Yw() {
            return uc;
          })() || eS
        )(z(n), e);
      }
      function oe(n, e = q.Default) {
        return N(n, xa(e));
      }
      function xa(n) {
        return typeof n > "u" || "number" == typeof n
          ? n
          : 0 |
              (n.optional && 8) |
              (n.host && 1) |
              (n.self && 2) |
              (n.skipSelf && 4);
      }
      function dc(n) {
        const e = [];
        for (let t = 0; t < n.length; t++) {
          const r = z(n[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new T(900, !1);
            let i,
              o = q.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = tS(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (o |= l)
                : (i = a);
            }
            e.push(N(i, o));
          } else e.push(N(r));
        }
        return e;
      }
      function Ro(n, e) {
        return (n[cc] = e), (n.prototype[cc] = e), n;
      }
      function tS(n) {
        return n[cc];
      }
      function Cr(n) {
        return { toString: n }.toString();
      }
      var fn = (() => (
          ((fn = fn || {})[(fn.OnPush = 0)] = "OnPush"),
          (fn[(fn.Default = 1)] = "Default"),
          fn
        ))(),
        hn = (() => {
          return (
            ((n = hn || (hn = {}))[(n.Emulated = 0)] = "Emulated"),
            (n[(n.None = 2)] = "None"),
            (n[(n.ShadowDom = 3)] = "ShadowDom"),
            hn
          );
          var n;
        })();
      const Yn = {},
        ge = [],
        Ra = De({ ɵcmp: De }),
        fc = De({ ɵdir: De }),
        hc = De({ ɵpipe: De }),
        ug = De({ ɵmod: De }),
        Xn = De({ ɵfac: De }),
        No = De({ __NG_ELEMENT_ID__: De });
      let iS = 0;
      function Ae(n) {
        return Cr(() => {
          const t = !0 === n.standalone,
            r = {},
            i = {
              type: n.type,
              providersResolver: null,
              decls: n.decls,
              vars: n.vars,
              factory: null,
              template: n.template || null,
              consts: n.consts || null,
              ngContentSelectors: n.ngContentSelectors,
              hostBindings: n.hostBindings || null,
              hostVars: n.hostVars || 0,
              hostAttrs: n.hostAttrs || null,
              contentQueries: n.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: n.exportAs || null,
              onPush: n.changeDetection === fn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: t,
              dependencies: (t && n.dependencies) || null,
              getStandaloneInjector: null,
              selectors: n.selectors || ge,
              viewQuery: n.viewQuery || null,
              features: n.features || null,
              data: n.data || {},
              encapsulation: n.encapsulation || hn.Emulated,
              id: "c" + iS++,
              styles: n.styles || ge,
              _: null,
              setInput: null,
              schemas: n.schemas || null,
              tView: null,
              findHostDirectiveDefs: null,
              hostDirectives: null,
            },
            o = n.dependencies,
            s = n.features;
          return (
            (i.inputs = fg(n.inputs, r)),
            (i.outputs = fg(n.outputs)),
            s && s.forEach((a) => a(i)),
            (i.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(cg).filter(dg)
              : null),
            (i.pipeDefs = o
              ? () => ("function" == typeof o ? o() : o).map(Ct).filter(dg)
              : null),
            i
          );
        });
      }
      function cg(n) {
        return ye(n) || ct(n);
      }
      function dg(n) {
        return null !== n;
      }
      function Qt(n) {
        return Cr(() => ({
          type: n.type,
          bootstrap: n.bootstrap || ge,
          declarations: n.declarations || ge,
          imports: n.imports || ge,
          exports: n.exports || ge,
          transitiveCompileScopes: null,
          schemas: n.schemas || null,
          id: n.id || null,
        }));
      }
      function fg(n, e) {
        if (null == n) return Yn;
        const t = {};
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            let i = n[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (t[i] = r),
              e && (e[i] = o);
          }
        return t;
      }
      const Y = Ae;
      function ye(n) {
        return n[Ra] || null;
      }
      function ct(n) {
        return n[fc] || null;
      }
      function Ct(n) {
        return n[hc] || null;
      }
      function kt(n, e) {
        const t = n[ug] || null;
        if (!t && !0 === e)
          throw new Error(`Type ${we(n)} does not have '\u0275mod' property.`);
        return t;
      }
      function Ot(n) {
        return Array.isArray(n) && "object" == typeof n[1];
      }
      function gn(n) {
        return Array.isArray(n) && !0 === n[1];
      }
      function mc(n) {
        return 0 != (4 & n.flags);
      }
      function Oo(n) {
        return n.componentOffset > -1;
      }
      function Oa(n) {
        return 1 == (1 & n.flags);
      }
      function mn(n) {
        return null !== n.template;
      }
      function aS(n) {
        return 0 != (256 & n[2]);
      }
      function zr(n, e) {
        return n.hasOwnProperty(Xn) ? n[Xn] : null;
      }
      class cS {
        constructor(e, t, r) {
          (this.previousValue = e),
            (this.currentValue = t),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Yt() {
        return yg;
      }
      function yg(n) {
        return n.type.prototype.ngOnChanges && (n.setInput = fS), dS;
      }
      function dS() {
        const n = Cg(this),
          e = n?.current;
        if (e) {
          const t = n.previous;
          if (t === Yn) n.previous = e;
          else for (let r in e) t[r] = e[r];
          (n.current = null), this.ngOnChanges(e);
        }
      }
      function fS(n, e, t, r) {
        const i = this.declaredInputs[t],
          o =
            Cg(n) ||
            (function hS(n, e) {
              return (n[vg] = e);
            })(n, { previous: Yn, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new cS(l && l.currentValue, e, a === Yn)), (n[r] = e);
      }
      Yt.ngInherit = !0;
      const vg = "__ngSimpleChanges__";
      function Cg(n) {
        return n[vg] || null;
      }
      function it(n) {
        for (; Array.isArray(n); ) n = n[0];
        return n;
      }
      function La(n, e) {
        return it(e[n]);
      }
      function Lt(n, e) {
        return it(e[n.index]);
      }
      function Eg(n, e) {
        return n.data[e];
      }
      function Vt(n, e) {
        const t = e[n];
        return Ot(t) ? t : t[0];
      }
      function Va(n) {
        return 64 == (64 & n[2]);
      }
      function Dr(n, e) {
        return null == e ? null : n[e];
      }
      function wg(n) {
        n[18] = 0;
      }
      function yc(n, e) {
        n[5] += e;
        let t = n,
          r = n[3];
        for (
          ;
          null !== r && ((1 === e && 1 === t[5]) || (-1 === e && 0 === t[5]));

        )
          (r[5] += e), (t = r), (r = r[3]);
      }
      const Z = { lFrame: Pg(null), bindingsEnabled: !0 };
      function Mg() {
        return Z.bindingsEnabled;
      }
      function A() {
        return Z.lFrame.lView;
      }
      function ue() {
        return Z.lFrame.tView;
      }
      function $(n) {
        return (Z.lFrame.contextLView = n), n[8];
      }
      function U(n) {
        return (Z.lFrame.contextLView = null), n;
      }
      function ot() {
        let n = Tg();
        for (; null !== n && 64 === n.type; ) n = n.parent;
        return n;
      }
      function Tg() {
        return Z.lFrame.currentTNode;
      }
      function xn(n, e) {
        const t = Z.lFrame;
        (t.currentTNode = n), (t.isParent = e);
      }
      function vc() {
        return Z.lFrame.isParent;
      }
      function Si() {
        return Z.lFrame.bindingIndex++;
      }
      function er(n) {
        const e = Z.lFrame,
          t = e.bindingIndex;
        return (e.bindingIndex = e.bindingIndex + n), t;
      }
      function MS(n, e) {
        const t = Z.lFrame;
        (t.bindingIndex = t.bindingRootIndex = n), Dc(e);
      }
      function Dc(n) {
        Z.lFrame.currentDirectiveIndex = n;
      }
      function Rg() {
        return Z.lFrame.currentQueryIndex;
      }
      function Ec(n) {
        Z.lFrame.currentQueryIndex = n;
      }
      function IS(n) {
        const e = n[1];
        return 2 === e.type ? e.declTNode : 1 === e.type ? n[6] : null;
      }
      function Ng(n, e, t) {
        if (t & q.SkipSelf) {
          let i = e,
            o = n;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              t & q.Host ||
              ((i = IS(o)), null === i || ((o = o[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (e = i), (n = o);
        }
        const r = (Z.lFrame = Fg());
        return (r.currentTNode = e), (r.lView = n), !0;
      }
      function wc(n) {
        const e = Fg(),
          t = n[1];
        (Z.lFrame = e),
          (e.currentTNode = t.firstChild),
          (e.lView = n),
          (e.tView = t),
          (e.contextLView = n),
          (e.bindingIndex = t.bindingStartIndex),
          (e.inI18n = !1);
      }
      function Fg() {
        const n = Z.lFrame,
          e = null === n ? null : n.child;
        return null === e ? Pg(n) : e;
      }
      function Pg(n) {
        const e = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: n,
          child: null,
          inI18n: !1,
        };
        return null !== n && (n.child = e), e;
      }
      function kg() {
        const n = Z.lFrame;
        return (
          (Z.lFrame = n.parent), (n.currentTNode = null), (n.lView = null), n
        );
      }
      const Og = kg;
      function Sc() {
        const n = kg();
        (n.isParent = !0),
          (n.tView = null),
          (n.selectedIndex = -1),
          (n.contextLView = null),
          (n.elementDepthCount = 0),
          (n.currentDirectiveIndex = -1),
          (n.currentNamespace = null),
          (n.bindingRootIndex = -1),
          (n.bindingIndex = -1),
          (n.currentQueryIndex = 0);
      }
      function Et() {
        return Z.lFrame.selectedIndex;
      }
      function qr(n) {
        Z.lFrame.selectedIndex = n;
      }
      function Ne() {
        const n = Z.lFrame;
        return Eg(n.tView, n.selectedIndex);
      }
      function $a(n, e) {
        for (let t = e.directiveStart, r = e.directiveEnd; t < r; t++) {
          const o = n.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = o;
          s && (n.contentHooks || (n.contentHooks = [])).push(-t, s),
            a &&
              ((n.contentHooks || (n.contentHooks = [])).push(t, a),
              (n.contentCheckHooks || (n.contentCheckHooks = [])).push(t, a)),
            l && (n.viewHooks || (n.viewHooks = [])).push(-t, l),
            u &&
              ((n.viewHooks || (n.viewHooks = [])).push(t, u),
              (n.viewCheckHooks || (n.viewCheckHooks = [])).push(t, u)),
            null != c && (n.destroyHooks || (n.destroyHooks = [])).push(t, c);
        }
      }
      function Ua(n, e, t) {
        Lg(n, e, 3, t);
      }
      function Ba(n, e, t, r) {
        (3 & n[2]) === t && Lg(n, e, t, r);
      }
      function Mc(n, e) {
        let t = n[2];
        (3 & t) === e && ((t &= 2047), (t += 1), (n[2] = t));
      }
      function Lg(n, e, t, r) {
        const o = r ?? -1,
          s = e.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & n[18] : 0; l < s; l++)
          if ("number" == typeof e[l + 1]) {
            if (((a = e[l]), null != r && a >= r)) break;
          } else
            e[l] < 0 && (n[18] += 65536),
              (a < o || -1 == o) &&
                (LS(n, t, e, l), (n[18] = (4294901760 & n[18]) + l + 2)),
              l++;
      }
      function LS(n, e, t, r) {
        const i = t[r] < 0,
          o = t[r + 1],
          a = n[i ? -t[r] : t[r]];
        if (i) {
          if (n[2] >> 11 < n[18] >> 16 && (3 & n[2]) === e) {
            n[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class Vo {
        constructor(e, t, r) {
          (this.factory = e),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = r);
        }
      }
      function Ic(n, e, t) {
        let r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = t[r++],
              s = t[r++],
              a = t[r++];
            n.setAttribute(e, s, a, o);
          } else {
            const o = i,
              s = t[++r];
            $g(o) ? n.setProperty(e, o, s) : n.setAttribute(e, o, s), r++;
          }
        }
        return r;
      }
      function Vg(n) {
        return 3 === n || 4 === n || 6 === n;
      }
      function $g(n) {
        return 64 === n.charCodeAt(0);
      }
      function $o(n, e) {
        if (null !== e && 0 !== e.length)
          if (null === n || 0 === n.length) n = e.slice();
          else {
            let t = -1;
            for (let r = 0; r < e.length; r++) {
              const i = e[r];
              "number" == typeof i
                ? (t = i)
                : 0 === t ||
                  Ug(n, t, i, null, -1 === t || 2 === t ? e[++r] : null);
            }
          }
        return n;
      }
      function Ug(n, e, t, r, i) {
        let o = 0,
          s = n.length;
        if (-1 === e) s = -1;
        else
          for (; o < n.length; ) {
            const a = n[o++];
            if ("number" == typeof a) {
              if (a === e) {
                s = -1;
                break;
              }
              if (a > e) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < n.length; ) {
          const a = n[o];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === r) return void (null !== i && (n[o + 1] = i));
            if (r === n[o + 1]) return void (n[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (n.splice(s, 0, e), (o = s + 1)),
          n.splice(o++, 0, t),
          null !== r && n.splice(o++, 0, r),
          null !== i && n.splice(o++, 0, i);
      }
      function Bg(n) {
        return -1 !== n;
      }
      function ja(n) {
        return 32767 & n;
      }
      function Ha(n, e) {
        let t = (function BS(n) {
            return n >> 16;
          })(n),
          r = e;
        for (; t > 0; ) (r = r[15]), t--;
        return r;
      }
      let Ac = !0;
      function Ga(n) {
        const e = Ac;
        return (Ac = n), e;
      }
      let jS = 0;
      const Rn = {};
      function za(n, e) {
        const t = Gg(n, e);
        if (-1 !== t) return t;
        const r = e[1];
        r.firstCreatePass &&
          ((n.injectorIndex = e.length),
          xc(r.data, n),
          xc(e, null),
          xc(r.blueprint, null));
        const i = Rc(n, e),
          o = n.injectorIndex;
        if (Bg(i)) {
          const s = ja(i),
            a = Ha(i, e),
            l = a[1].data;
          for (let u = 0; u < 8; u++) e[o + u] = a[s + u] | l[s + u];
        }
        return (e[o + 8] = i), o;
      }
      function xc(n, e) {
        n.push(0, 0, 0, 0, 0, 0, 0, 0, e);
      }
      function Gg(n, e) {
        return -1 === n.injectorIndex ||
          (n.parent && n.parent.injectorIndex === n.injectorIndex) ||
          null === e[n.injectorIndex + 8]
          ? -1
          : n.injectorIndex;
      }
      function Rc(n, e) {
        if (n.parent && -1 !== n.parent.injectorIndex)
          return n.parent.injectorIndex;
        let t = 0,
          r = null,
          i = e;
        for (; null !== i; ) {
          if (((r = Xg(i)), null === r)) return -1;
          if ((t++, (i = i[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (t << 16);
        }
        return -1;
      }
      function Nc(n, e, t) {
        !(function HS(n, e, t) {
          let r;
          "string" == typeof t
            ? (r = t.charCodeAt(0) || 0)
            : t.hasOwnProperty(No) && (r = t[No]),
            null == r && (r = t[No] = jS++);
          const i = 255 & r;
          e.data[n + (i >> 5)] |= 1 << i;
        })(n, e, t);
      }
      function zg(n, e, t) {
        if (t & q.Optional || void 0 !== n) return n;
        Ma();
      }
      function qg(n, e, t, r) {
        if (
          (t & q.Optional && void 0 === r && (r = null),
          !(t & (q.Self | q.Host)))
        ) {
          const i = n[9],
            o = Kt(void 0);
          try {
            return i ? i.get(e, r, t & q.Optional) : sg(e, r, t & q.Optional);
          } finally {
            Kt(o);
          }
        }
        return zg(r, 0, t);
      }
      function Wg(n, e, t, r = q.Default, i) {
        if (null !== n) {
          if (1024 & e[2]) {
            const s = (function KS(n, e, t, r, i) {
              let o = n,
                s = e;
              for (
                ;
                null !== o && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = Kg(o, s, t, r | q.Self, Rn);
                if (a !== Rn) return a;
                let l = o.parent;
                if (!l) {
                  const u = s[21];
                  if (u) {
                    const c = u.get(t, Rn, r);
                    if (c !== Rn) return c;
                  }
                  (l = Xg(s)), (s = s[15]);
                }
                o = l;
              }
              return i;
            })(n, e, t, r, Rn);
            if (s !== Rn) return s;
          }
          const o = Kg(n, e, t, r, Rn);
          if (o !== Rn) return o;
        }
        return qg(e, t, r, i);
      }
      function Kg(n, e, t, r, i) {
        const o = (function qS(n) {
          if ("string" == typeof n) return n.charCodeAt(0) || 0;
          const e = n.hasOwnProperty(No) ? n[No] : void 0;
          return "number" == typeof e ? (e >= 0 ? 255 & e : WS) : e;
        })(t);
        if ("function" == typeof o) {
          if (!Ng(e, n, r)) return r & q.Host ? zg(i, 0, r) : qg(e, t, r, i);
          try {
            const s = o(r);
            if (null != s || r & q.Optional) return s;
            Ma();
          } finally {
            Og();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = Gg(n, e),
            l = -1,
            u = r & q.Host ? e[16][6] : null;
          for (
            (-1 === a || r & q.SkipSelf) &&
            ((l = -1 === a ? Rc(n, e) : e[a + 8]),
            -1 !== l && Yg(r, !1)
              ? ((s = e[1]), (a = ja(l)), (e = Ha(l, e)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = e[1];
            if (Qg(o, a, c.data)) {
              const d = zS(a, e, t, s, r, u);
              if (d !== Rn) return d;
            }
            (l = e[a + 8]),
              -1 !== l && Yg(r, e[1].data[a + 8] === u) && Qg(o, a, e)
                ? ((s = c), (a = ja(l)), (e = Ha(l, e)))
                : (a = -1);
          }
        }
        return i;
      }
      function zS(n, e, t, r, i, o) {
        const s = e[1],
          a = s.data[n + 8],
          c = qa(
            a,
            s,
            t,
            null == r ? Oo(a) && Ac : r != s && 0 != (3 & a.type),
            i & q.Host && o === a
          );
        return null !== c ? Wr(e, s, c, a) : Rn;
      }
      function qa(n, e, t, r, i) {
        const o = n.providerIndexes,
          s = e.data,
          a = 1048575 & o,
          l = n.directiveStart,
          c = o >> 20,
          p = i ? a + c : n.directiveEnd;
        for (let g = r ? a : a + c; g < p; g++) {
          const m = s[g];
          if ((g < l && t === m) || (g >= l && m.type === t)) return g;
        }
        if (i) {
          const g = s[l];
          if (g && mn(g) && g.type === t) return l;
        }
        return null;
      }
      function Wr(n, e, t, r) {
        let i = n[t];
        const o = e.data;
        if (
          (function VS(n) {
            return n instanceof Vo;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function Bw(n, e) {
              const t = e ? `. Dependency path: ${e.join(" > ")} > ${n}` : "";
              throw new T(
                -200,
                `Circular dependency in DI detected for ${n}${t}`
              );
            })(
              (function me(n) {
                return "function" == typeof n
                  ? n.name || n.toString()
                  : "object" == typeof n &&
                    null != n &&
                    "function" == typeof n.type
                  ? n.type.name || n.type.toString()
                  : X(n);
              })(o[t])
            );
          const a = Ga(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Kt(s.injectImpl) : null;
          Ng(n, r, q.Default);
          try {
            (i = n[t] = s.factory(void 0, o, n, r)),
              e.firstCreatePass &&
                t >= r.directiveStart &&
                (function OS(n, e, t) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = e.type.prototype;
                  if (r) {
                    const s = yg(e);
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(n, s),
                      (
                        t.preOrderCheckHooks || (t.preOrderCheckHooks = [])
                      ).push(n, s);
                  }
                  i &&
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(0 - n, i),
                    o &&
                      ((t.preOrderHooks || (t.preOrderHooks = [])).push(n, o),
                      (
                        t.preOrderCheckHooks || (t.preOrderCheckHooks = [])
                      ).push(n, o));
                })(t, o[t], e);
          } finally {
            null !== l && Kt(l), Ga(a), (s.resolving = !1), Og();
          }
        }
        return i;
      }
      function Qg(n, e, t) {
        return !!(t[e + (n >> 5)] & (1 << n));
      }
      function Yg(n, e) {
        return !(n & q.Self || (n & q.Host && e));
      }
      class Ti {
        constructor(e, t) {
          (this._tNode = e), (this._lView = t);
        }
        get(e, t, r) {
          return Wg(this._tNode, this._lView, e, xa(r), t);
        }
      }
      function WS() {
        return new Ti(ot(), A());
      }
      function st(n) {
        return Cr(() => {
          const e = n.prototype.constructor,
            t = e[Xn] || Fc(e),
            r = Object.prototype;
          let i = Object.getPrototypeOf(n.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[Xn] || Fc(i);
            if (o && o !== t) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function Fc(n) {
        return sc(n)
          ? () => {
              const e = Fc(z(n));
              return e && e();
            }
          : zr(n);
      }
      function Xg(n) {
        const e = n[1],
          t = e.type;
        return 2 === t ? e.declTNode : 1 === t ? n[6] : null;
      }
      const Ai = "__parameters__";
      function Ri(n, e, t) {
        return Cr(() => {
          const r = (function Pc(n) {
            return function (...t) {
              if (n) {
                const r = n(...t);
                for (const i in r) this[i] = r[i];
              }
            };
          })(e);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Ai)
                ? l[Ai]
                : Object.defineProperty(l, Ai, { value: [] })[Ai];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            t && (i.prototype = Object.create(t.prototype)),
            (i.prototype.ngMetadataName = n),
            (i.annotationCls = i),
            i
          );
        });
      }
      class V {
        constructor(e, t) {
          (this._desc = e),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = O({
                  token: this,
                  providedIn: t.providedIn || "root",
                  factory: t.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function Kr(n, e) {
        n.forEach((t) => (Array.isArray(t) ? Kr(t, e) : e(t)));
      }
      function Jg(n, e, t) {
        e >= n.length ? n.push(t) : n.splice(e, 0, t);
      }
      function Ka(n, e) {
        return e >= n.length - 1 ? n.pop() : n.splice(e, 1)[0];
      }
      function $t(n, e, t) {
        let r = Ni(n, e);
        return (
          r >= 0
            ? (n[1 | r] = t)
            : ((r = ~r),
              (function ZS(n, e, t, r) {
                let i = n.length;
                if (i == e) n.push(t, r);
                else if (1 === i) n.push(r, n[0]), (n[0] = t);
                else {
                  for (i--, n.push(n[i - 1], n[i]); i > e; )
                    (n[i] = n[i - 2]), i--;
                  (n[e] = t), (n[e + 1] = r);
                }
              })(n, r, e, t)),
          r
        );
      }
      function Oc(n, e) {
        const t = Ni(n, e);
        if (t >= 0) return n[1 | t];
      }
      function Ni(n, e) {
        return (function em(n, e, t) {
          let r = 0,
            i = n.length >> t;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = n[o << t];
            if (e === s) return o << t;
            s > e ? (i = o) : (r = o + 1);
          }
          return ~(i << t);
        })(n, e, 1);
      }
      const Ho = Ro(Ri("Optional"), 8),
        Go = Ro(Ri("SkipSelf"), 4);
      var It = (() => (
        ((It = It || {})[(It.Important = 1)] = "Important"),
        (It[(It.DashCase = 2)] = "DashCase"),
        It
      ))();
      const jc = new Map();
      let D0 = 0;
      const Gc = "__ngContext__";
      function ht(n, e) {
        Ot(e)
          ? ((n[Gc] = e[20]),
            (function E0(n) {
              jc.set(n[20], n);
            })(e))
          : (n[Gc] = e);
      }
      function qc(n, e) {
        return undefined(n, e);
      }
      function Ko(n) {
        const e = n[3];
        return gn(e) ? e[3] : e;
      }
      function Wc(n) {
        return Cm(n[13]);
      }
      function Kc(n) {
        return Cm(n[4]);
      }
      function Cm(n) {
        for (; null !== n && !gn(n); ) n = n[4];
        return n;
      }
      function Pi(n, e, t, r, i) {
        if (null != r) {
          let o,
            s = !1;
          gn(r) ? (o = r) : Ot(r) && ((s = !0), (r = r[0]));
          const a = it(r);
          0 === n && null !== t
            ? null == i
              ? Mm(e, t, a)
              : Qr(e, t, a, i || null, !0)
            : 1 === n && null !== t
            ? Qr(e, t, a, i || null, !0)
            : 2 === n
            ? (function td(n, e, t) {
                const r = Za(n, e);
                r &&
                  (function H0(n, e, t, r) {
                    n.removeChild(e, t, r);
                  })(n, r, e, t);
              })(e, a, s)
            : 3 === n && e.destroyNode(a),
            null != o &&
              (function q0(n, e, t, r, i) {
                const o = t[7];
                o !== it(t) && Pi(e, n, r, o, i);
                for (let a = 10; a < t.length; a++) {
                  const l = t[a];
                  Qo(l[1], l, n, e, r, o);
                }
              })(e, n, o, t, i);
        }
      }
      function Yc(n, e, t) {
        return n.createElement(e, t);
      }
      function bm(n, e) {
        const t = n[9],
          r = t.indexOf(e),
          i = e[3];
        512 & e[2] && ((e[2] &= -513), yc(i, -1)), t.splice(r, 1);
      }
      function Xc(n, e) {
        if (n.length <= 10) return;
        const t = 10 + e,
          r = n[t];
        if (r) {
          const i = r[17];
          null !== i && i !== n && bm(i, r), e > 0 && (n[t - 1][4] = r[4]);
          const o = Ka(n, 10 + e);
          !(function k0(n, e) {
            Qo(n, e, e[11], 2, null, null), (e[0] = null), (e[6] = null);
          })(r[1], r);
          const s = o[19];
          null !== s && s.detachView(o[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function Em(n, e) {
        if (!(128 & e[2])) {
          const t = e[11];
          t.destroyNode && Qo(n, e, t, 3, null, null),
            (function V0(n) {
              let e = n[13];
              if (!e) return Zc(n[1], n);
              for (; e; ) {
                let t = null;
                if (Ot(e)) t = e[13];
                else {
                  const r = e[10];
                  r && (t = r);
                }
                if (!t) {
                  for (; e && !e[4] && e !== n; )
                    Ot(e) && Zc(e[1], e), (e = e[3]);
                  null === e && (e = n), Ot(e) && Zc(e[1], e), (t = e && e[4]);
                }
                e = t;
              }
            })(e);
        }
      }
      function Zc(n, e) {
        if (!(128 & e[2])) {
          (e[2] &= -65),
            (e[2] |= 128),
            (function j0(n, e) {
              let t;
              if (null != n && null != (t = n.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const i = e[t[r]];
                  if (!(i instanceof Vo)) {
                    const o = t[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(i);
                      } finally {
                      }
                  }
                }
            })(n, e),
            (function B0(n, e) {
              const t = n.cleanup,
                r = e[7];
              let i = -1;
              if (null !== t)
                for (let o = 0; o < t.length - 1; o += 2)
                  if ("string" == typeof t[o]) {
                    const s = t[o + 3];
                    s >= 0 ? r[(i = s)]() : r[(i = -s)].unsubscribe(), (o += 2);
                  } else {
                    const s = r[(i = t[o + 1])];
                    t[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) (0, r[o])();
                e[7] = null;
              }
            })(n, e),
            1 === e[1].type && e[11].destroy();
          const t = e[17];
          if (null !== t && gn(e[3])) {
            t !== e[3] && bm(t, e);
            const r = e[19];
            null !== r && r.detachView(n);
          }
          !(function w0(n) {
            jc.delete(n[20]);
          })(e);
        }
      }
      function wm(n, e, t) {
        return (function Sm(n, e, t) {
          let r = e;
          for (; null !== r && 40 & r.type; ) r = (e = r).parent;
          if (null === r) return t[0];
          {
            const { componentOffset: i } = r;
            if (i > -1) {
              const { encapsulation: o } = n.data[r.directiveStart + i];
              if (o === hn.None || o === hn.Emulated) return null;
            }
            return Lt(r, t);
          }
        })(n, e.parent, t);
      }
      function Qr(n, e, t, r, i) {
        n.insertBefore(e, t, r, i);
      }
      function Mm(n, e, t) {
        n.appendChild(e, t);
      }
      function Tm(n, e, t, r, i) {
        null !== r ? Qr(n, e, t, r, i) : Mm(n, e, t);
      }
      function Za(n, e) {
        return n.parentNode(e);
      }
      let id,
        nl,
        xm = function Am(n, e, t) {
          return 40 & n.type ? Lt(n, t) : null;
        };
      function Ja(n, e, t, r) {
        const i = wm(n, r, e),
          o = e[11],
          a = (function Im(n, e, t) {
            return xm(n, e, t);
          })(r.parent || e[6], r, e);
        if (null != i)
          if (Array.isArray(t))
            for (let l = 0; l < t.length; l++) Tm(o, i, t[l], a, !1);
          else Tm(o, i, t, a, !1);
      }
      function el(n, e) {
        if (null !== e) {
          const t = e.type;
          if (3 & t) return Lt(e, n);
          if (4 & t) return ed(-1, n[e.index]);
          if (8 & t) {
            const r = e.child;
            if (null !== r) return el(n, r);
            {
              const i = n[e.index];
              return gn(i) ? ed(-1, i) : it(i);
            }
          }
          if (32 & t) return qc(e, n)() || it(n[e.index]);
          {
            const r = Nm(n, e);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : el(Ko(n[16]), r)
              : el(n, e.next);
          }
        }
        return null;
      }
      function Nm(n, e) {
        return null !== e ? n[16][6].projection[e.projection] : null;
      }
      function ed(n, e) {
        const t = 10 + n + 1;
        if (t < e.length) {
          const r = e[t],
            i = r[1].firstChild;
          if (null !== i) return el(r, i);
        }
        return e[7];
      }
      function nd(n, e, t, r, i, o, s) {
        for (; null != t; ) {
          const a = r[t.index],
            l = t.type;
          if (
            (s && 0 === e && (a && ht(it(a), r), (t.flags |= 2)),
            32 != (32 & t.flags))
          )
            if (8 & l) nd(n, e, t.child, r, i, o, !1), Pi(e, n, i, a, o);
            else if (32 & l) {
              const u = qc(t, r);
              let c;
              for (; (c = u()); ) Pi(e, n, i, c, o);
              Pi(e, n, i, a, o);
            } else 16 & l ? Fm(n, e, r, t, i, o) : Pi(e, n, i, a, o);
          t = s ? t.projectionNext : t.next;
        }
      }
      function Qo(n, e, t, r, i, o) {
        nd(t, r, n.firstChild, e, i, o, !1);
      }
      function Fm(n, e, t, r, i, o) {
        const s = t[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Pi(e, n, i, l[u], o);
        else nd(n, e, l, s[3], i, o, !0);
      }
      function Pm(n, e, t) {
        "" === t
          ? n.removeAttribute(e, "class")
          : n.setAttribute(e, "class", t);
      }
      function km(n, e, t) {
        const { mergedAttrs: r, classes: i, styles: o } = t;
        null !== r && Ic(n, e, r),
          null !== i && Pm(n, e, i),
          null !== o &&
            (function K0(n, e, t) {
              n.setAttribute(e, "style", t);
            })(n, e, o);
      }
      function $m(n) {
        return (
          (function od() {
            if (void 0 === nl && ((nl = null), Me.trustedTypes))
              try {
                nl = Me.trustedTypes.createPolicy("angular#unsafe-bypass", {
                  createHTML: (n) => n,
                  createScript: (n) => n,
                  createScriptURL: (n) => n,
                });
              } catch {}
            return nl;
          })()?.createScriptURL(n) || n
        );
      }
      class Um {
        constructor(e) {
          this.changingThisBreaksApplicationSecurity = e;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ng})`;
        }
      }
      function br(n) {
        return n instanceof Um ? n.changingThisBreaksApplicationSecurity : n;
      }
      function Yo(n, e) {
        const t = (function iM(n) {
          return (n instanceof Um && n.getTypeName()) || null;
        })(n);
        if (null != t && t !== e) {
          if ("ResourceURL" === t && "URL" === e) return !0;
          throw new Error(`Required a safe ${e}, got a ${t} (see ${ng})`);
        }
        return t === e;
      }
      const lM =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var qe = (() => (
        ((qe = qe || {})[(qe.NONE = 0)] = "NONE"),
        (qe[(qe.HTML = 1)] = "HTML"),
        (qe[(qe.STYLE = 2)] = "STYLE"),
        (qe[(qe.SCRIPT = 3)] = "SCRIPT"),
        (qe[(qe.URL = 4)] = "URL"),
        (qe[(qe.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        qe
      ))();
      function Wm(n) {
        const e = Zo();
        return e
          ? e.sanitize(qe.URL, n) || ""
          : Yo(n, "URL")
          ? br(n)
          : (function sd(n) {
              return (n = String(n)).match(lM) ? n : "unsafe:" + n;
            })(X(n));
      }
      function Km(n) {
        const e = Zo();
        if (e) return $m(e.sanitize(qe.RESOURCE_URL, n) || "");
        if (Yo(n, "ResourceURL")) return $m(br(n));
        throw new T(904, !1);
      }
      function Zo() {
        const n = A();
        return n && n[12];
      }
      const il = new V("ENVIRONMENT_INITIALIZER"),
        Ym = new V("INJECTOR", -1),
        Xm = new V("INJECTOR_DEF_TYPES");
      class Zm {
        get(e, t = Ao) {
          if (t === Ao) {
            const r = new Error(`NullInjectorError: No provider for ${we(e)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return t;
        }
      }
      function bM(...n) {
        return { ɵproviders: Jm(0, n), ɵfromNgModule: !0 };
      }
      function Jm(n, ...e) {
        const t = [],
          r = new Set();
        let i;
        return (
          Kr(e, (o) => {
            const s = o;
            cd(s, t, [], r) && (i || (i = []), i.push(s));
          }),
          void 0 !== i && e_(i, t),
          t
        );
      }
      function e_(n, e) {
        for (let t = 0; t < n.length; t++) {
          const { providers: i } = n[t];
          dd(i, (o) => {
            e.push(o);
          });
        }
      }
      function cd(n, e, t, r) {
        if (!(n = z(n))) return !1;
        let i = null,
          o = ig(n);
        const s = !o && ye(n);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = n;
        } else {
          const l = n.ngModule;
          if (((o = ig(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of l) cd(u, e, t, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let u;
              r.add(i);
              try {
                Kr(o.imports, (c) => {
                  cd(c, e, t, r) && (u || (u = []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && e_(u, e);
            }
            if (!a) {
              const u = zr(i) || (() => new i());
              e.push(
                { provide: i, useFactory: u, deps: ge },
                { provide: Xm, useValue: i, multi: !0 },
                { provide: il, useValue: () => N(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              dd(l, (c) => {
                e.push(c);
              });
          }
        }
        return i !== n && void 0 !== n.providers;
      }
      function dd(n, e) {
        for (let t of n)
          ac(t) && (t = t.ɵproviders), Array.isArray(t) ? dd(t, e) : e(t);
      }
      const EM = De({ provide: String, useValue: De });
      function fd(n) {
        return null !== n && "object" == typeof n && EM in n;
      }
      function Xr(n) {
        return "function" == typeof n;
      }
      const hd = new V("Set Injector scope."),
        ol = {},
        SM = {};
      let pd;
      function sl() {
        return void 0 === pd && (pd = new Zm()), pd;
      }
      class Nn {}
      class r_ extends Nn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(e, t, r, i) {
          super(),
            (this.parent = t),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            md(e, (s) => this.processProvider(s)),
            this.records.set(Ym, ki(void 0, this)),
            i.has("environment") && this.records.set(Nn, ki(void 0, this));
          const o = this.records.get(hd);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(Xm.multi, ge, q.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const e of this._ngOnDestroyHooks) e.ngOnDestroy();
            for (const e of this._onDestroyHooks) e();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(e) {
          this._onDestroyHooks.push(e);
        }
        runInContext(e) {
          this.assertNotDestroyed();
          const t = yi(this),
            r = Kt(void 0);
          try {
            return e();
          } finally {
            yi(t), Kt(r);
          }
        }
        get(e, t = Ao, r = q.Default) {
          this.assertNotDestroyed(), (r = xa(r));
          const i = yi(this),
            o = Kt(void 0);
          try {
            if (!(r & q.SkipSelf)) {
              let a = this.records.get(e);
              if (void 0 === a) {
                const l =
                  (function xM(n) {
                    return (
                      "function" == typeof n ||
                      ("object" == typeof n && n instanceof V)
                    );
                  })(e) && Ta(e);
                (a = l && this.injectableDefInScope(l) ? ki(gd(e), ol) : null),
                  this.records.set(e, a);
              }
              if (null != a) return this.hydrate(e, a);
            }
            return (r & q.Self ? sl() : this.parent).get(
              e,
              (t = r & q.Optional && t === Ao ? null : t)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Aa] = s[Aa] || []).unshift(we(e)), i)) throw s;
              return (function nS(n, e, t, r) {
                const i = n[Aa];
                throw (
                  (e[ag] && i.unshift(e[ag]),
                  (n.message = (function rS(n, e, t, r = null) {
                    n =
                      n && "\n" === n.charAt(0) && "\u0275" == n.charAt(1)
                        ? n.slice(2)
                        : n;
                    let i = we(e);
                    if (Array.isArray(e)) i = e.map(we).join(" -> ");
                    else if ("object" == typeof e) {
                      let o = [];
                      for (let s in e)
                        if (e.hasOwnProperty(s)) {
                          let a = e[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : we(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${t}${r ? "(" + r + ")" : ""}[${i}]: ${n.replace(
                      Zw,
                      "\n  "
                    )}`;
                  })("\n" + n.message, i, t, r)),
                  (n.ngTokenPath = i),
                  (n[Aa] = null),
                  n)
                );
              })(s, e, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Kt(o), yi(i);
          }
        }
        resolveInjectorInitializers() {
          const e = yi(this),
            t = Kt(void 0);
          try {
            const r = this.get(il.multi, ge, q.Self);
            for (const i of r) i();
          } finally {
            yi(e), Kt(t);
          }
        }
        toString() {
          const e = [],
            t = this.records;
          for (const r of t.keys()) e.push(we(r));
          return `R3Injector[${e.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new T(205, !1);
        }
        processProvider(e) {
          let t = Xr((e = z(e))) ? e : z(e && e.provide);
          const r = (function TM(n) {
            return fd(n) ? ki(void 0, n.useValue) : ki(i_(n), ol);
          })(e);
          if (Xr(e) || !0 !== e.multi) this.records.get(t);
          else {
            let i = this.records.get(t);
            i ||
              ((i = ki(void 0, ol, !0)),
              (i.factory = () => dc(i.multi)),
              this.records.set(t, i)),
              (t = e),
              i.multi.push(e);
          }
          this.records.set(t, r);
        }
        hydrate(e, t) {
          return (
            t.value === ol && ((t.value = SM), (t.value = t.factory())),
            "object" == typeof t.value &&
              t.value &&
              (function AM(n) {
                return (
                  null !== n &&
                  "object" == typeof n &&
                  "function" == typeof n.ngOnDestroy
                );
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(e) {
          if (!e.providedIn) return !1;
          const t = z(e.providedIn);
          return "string" == typeof t
            ? "any" === t || this.scopes.has(t)
            : this.injectorDefTypes.has(t);
        }
      }
      function gd(n) {
        const e = Ta(n),
          t = null !== e ? e.factory : zr(n);
        if (null !== t) return t;
        if (n instanceof V) throw new T(204, !1);
        if (n instanceof Function)
          return (function MM(n) {
            const e = n.length;
            if (e > 0)
              throw (
                ((function jo(n, e) {
                  const t = [];
                  for (let r = 0; r < n; r++) t.push(e);
                  return t;
                })(e, "?"),
                new T(204, !1))
              );
            const t = (function Ww(n) {
              const e = n && (n[Ia] || n[og]);
              if (e) {
                const t = (function Kw(n) {
                  if (n.hasOwnProperty("name")) return n.name;
                  const e = ("" + n).match(/^function\s*([^\s(]+)/);
                  return null === e ? "" : e[1];
                })(n);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${t}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${t}" class.`
                  ),
                  e
                );
              }
              return null;
            })(n);
            return null !== t ? () => t.factory(n) : () => new n();
          })(n);
        throw new T(204, !1);
      }
      function i_(n, e, t) {
        let r;
        if (Xr(n)) {
          const i = z(n);
          return zr(i) || gd(i);
        }
        if (fd(n)) r = () => z(n.useValue);
        else if (
          (function n_(n) {
            return !(!n || !n.useFactory);
          })(n)
        )
          r = () => n.useFactory(...dc(n.deps || []));
        else if (
          (function t_(n) {
            return !(!n || !n.useExisting);
          })(n)
        )
          r = () => N(z(n.useExisting));
        else {
          const i = z(n && (n.useClass || n.provide));
          if (
            !(function IM(n) {
              return !!n.deps;
            })(n)
          )
            return zr(i) || gd(i);
          r = () => new i(...dc(n.deps));
        }
        return r;
      }
      function ki(n, e, t = !1) {
        return { factory: n, value: e, multi: t ? [] : void 0 };
      }
      function md(n, e) {
        for (const t of n)
          Array.isArray(t) ? md(t, e) : t && ac(t) ? md(t.ɵproviders, e) : e(t);
      }
      class RM {}
      class o_ {}
      class FM {
        resolveComponentFactory(e) {
          throw (function NM(n) {
            const e = Error(
              `No component factory found for ${we(
                n
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (e.ngComponent = n), e;
          })(e);
        }
      }
      let Jo = (() => {
        class n {}
        return (n.NULL = new FM()), n;
      })();
      function PM() {
        return Oi(ot(), A());
      }
      function Oi(n, e) {
        return new Ut(Lt(n, e));
      }
      let Ut = (() => {
        class n {
          constructor(t) {
            this.nativeElement = t;
          }
        }
        return (n.__NG_ELEMENT_ID__ = PM), n;
      })();
      function kM(n) {
        return n instanceof Ut ? n.nativeElement : n;
      }
      class es {}
      let nr = (() => {
          class n {}
          return (
            (n.__NG_ELEMENT_ID__ = () =>
              (function OM() {
                const n = A(),
                  t = Vt(ot().index, n);
                return (Ot(t) ? t : n)[11];
              })()),
            n
          );
        })(),
        LM = (() => {
          class n {}
          return (
            (n.ɵprov = O({
              token: n,
              providedIn: "root",
              factory: () => null,
            })),
            n
          );
        })();
      class ts {
        constructor(e) {
          (this.full = e),
            (this.major = e.split(".")[0]),
            (this.minor = e.split(".")[1]),
            (this.patch = e.split(".").slice(2).join("."));
        }
      }
      const VM = new ts("15.1.2"),
        _d = {};
      function vd(n) {
        return n.ngOriginalError;
      }
      class Li {
        constructor() {
          this._console = console;
        }
        handleError(e) {
          const t = this._findOriginalError(e);
          this._console.error("ERROR", e),
            t && this._console.error("ORIGINAL ERROR", t);
        }
        _findOriginalError(e) {
          let t = e && vd(e);
          for (; t && vd(t); ) t = vd(t);
          return t || null;
        }
      }
      function rr(n) {
        return n instanceof Function ? n() : n;
      }
      function l_(n, e, t) {
        let r = n.length;
        for (;;) {
          const i = n.indexOf(e, t);
          if (-1 === i) return i;
          if (0 === i || n.charCodeAt(i - 1) <= 32) {
            const o = e.length;
            if (i + o === r || n.charCodeAt(i + o) <= 32) return i;
          }
          t = i + 1;
        }
      }
      const u_ = "ng-template";
      function QM(n, e, t) {
        let r = 0;
        for (; r < n.length; ) {
          let i = n[r++];
          if (t && "class" === i) {
            if (((i = n[r]), -1 !== l_(i.toLowerCase(), e, 0))) return !0;
          } else if (1 === i) {
            for (; r < n.length && "string" == typeof (i = n[r++]); )
              if (i.toLowerCase() === e) return !0;
            return !1;
          }
        }
        return !1;
      }
      function c_(n) {
        return 4 === n.type && n.value !== u_;
      }
      function YM(n, e, t) {
        return e === (4 !== n.type || t ? n.value : u_);
      }
      function XM(n, e, t) {
        let r = 4;
        const i = n.attrs || [],
          o = (function eT(n) {
            for (let e = 0; e < n.length; e++) if (Vg(n[e])) return e;
            return n.length;
          })(i);
        let s = !1;
        for (let a = 0; a < e.length; a++) {
          const l = e[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !YM(n, l, t)) || ("" === l && 1 === e.length))
                ) {
                  if (_n(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : e[++a];
                if (8 & r && null !== n.attrs) {
                  if (!QM(n.attrs, u, t)) {
                    if (_n(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = ZM(8 & r ? "class" : l, i, c_(n), t);
                if (-1 === d) {
                  if (_n(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let p;
                  p = d > o ? "" : i[d + 1].toLowerCase();
                  const g = 8 & r ? p : null;
                  if ((g && -1 !== l_(g, u, 0)) || (2 & r && u !== p)) {
                    if (_n(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !_n(r) && !_n(l)) return !1;
            if (s && _n(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return _n(r) || s;
      }
      function _n(n) {
        return 0 == (1 & n);
      }
      function ZM(n, e, t, r) {
        if (null === e) return -1;
        let i = 0;
        if (r || !t) {
          let o = !1;
          for (; i < e.length; ) {
            const s = e[i];
            if (s === n) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = e[++i];
                for (; "string" == typeof a; ) a = e[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function tT(n, e) {
          let t = n.indexOf(4);
          if (t > -1)
            for (t++; t < n.length; ) {
              const r = n[t];
              if ("number" == typeof r) return -1;
              if (r === e) return t;
              t++;
            }
          return -1;
        })(e, n);
      }
      function d_(n, e, t = !1) {
        for (let r = 0; r < e.length; r++) if (XM(n, e[r], t)) return !0;
        return !1;
      }
      function f_(n, e) {
        return n ? ":not(" + e.trim() + ")" : e;
      }
      function rT(n) {
        let e = n[0],
          t = 1,
          r = 2,
          i = "",
          o = !1;
        for (; t < n.length; ) {
          let s = n[t];
          if ("string" == typeof s)
            if (2 & r) {
              const a = n[++t];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !_n(s) && ((e += f_(o, i)), (i = "")),
              (r = s),
              (o = o || !_n(r));
          t++;
        }
        return "" !== i && (e += f_(o, i)), e;
      }
      const J = {};
      function y(n) {
        h_(ue(), A(), Et() + n, !1);
      }
      function h_(n, e, t, r) {
        if (!r)
          if (3 == (3 & e[2])) {
            const o = n.preOrderCheckHooks;
            null !== o && Ua(e, o, t);
          } else {
            const o = n.preOrderHooks;
            null !== o && Ba(e, o, 0, t);
          }
        qr(t);
      }
      function __(n, e = null, t = null, r) {
        const i = y_(n, e, t, r);
        return i.resolveInjectorInitializers(), i;
      }
      function y_(n, e = null, t = null, r, i = new Set()) {
        const o = [t || ge, bM(n)];
        return (
          (r = r || ("object" == typeof n ? void 0 : we(n))),
          new r_(o, e || sl(), r || null, i)
        );
      }
      let Jt = (() => {
        class n {
          static create(t, r) {
            if (Array.isArray(t)) return __({ name: "" }, r, t, "");
            {
              const i = t.name ?? "";
              return __({ name: i }, t.parent, t.providers, i);
            }
          }
        }
        return (
          (n.THROW_IF_NOT_FOUND = Ao),
          (n.NULL = new Zm()),
          (n.ɵprov = O({ token: n, providedIn: "any", factory: () => N(Ym) })),
          (n.__NG_ELEMENT_ID__ = -1),
          n
        );
      })();
      function M(n, e = q.Default) {
        const t = A();
        return null === t ? N(n, e) : Wg(ot(), t, z(n), e);
      }
      function M_(n, e) {
        const t = n.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const o = t[r + 1];
            if (-1 !== o) {
              const s = n.data[o];
              Ec(t[r]), s.contentQueries(2, e[o], o);
            }
          }
      }
      function ll(n, e, t, r, i, o, s, a, l, u, c) {
        const d = e.blueprint.slice();
        return (
          (d[0] = i),
          (d[2] = 76 | r),
          (null !== c || (n && 1024 & n[2])) && (d[2] |= 1024),
          wg(d),
          (d[3] = d[15] = n),
          (d[8] = t),
          (d[10] = s || (n && n[10])),
          (d[11] = a || (n && n[11])),
          (d[12] = l || (n && n[12]) || null),
          (d[9] = u || (n && n[9]) || null),
          (d[6] = o),
          (d[20] = (function b0() {
            return D0++;
          })()),
          (d[21] = c),
          (d[16] = 2 == e.type ? n[16] : d),
          d
        );
      }
      function Ui(n, e, t, r, i) {
        let o = n.data[e];
        if (null === o)
          (o = (function wd(n, e, t, r, i) {
            const o = Tg(),
              s = vc(),
              l = (n.data[e] = (function AT(n, e, t, r, i, o) {
                return {
                  type: t,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: e ? e.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
                  attrs: o,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: e,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? o : o && o.parent, t, e, r, i));
            return (
              null === n.firstChild && (n.firstChild = l),
              null !== o &&
                (s
                  ? null == o.child && null !== l.parent && (o.child = l)
                  : null === o.next && (o.next = l)),
              l
            );
          })(n, e, t, r, i)),
            (function SS() {
              return Z.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = t), (o.value = r), (o.attrs = i);
          const s = (function Lo() {
            const n = Z.lFrame,
              e = n.currentTNode;
            return n.isParent ? e : e.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return xn(o, !0), o;
      }
      function ns(n, e, t, r) {
        if (0 === t) return -1;
        const i = e.length;
        for (let o = 0; o < t; o++)
          e.push(r), n.blueprint.push(r), n.data.push(null);
        return i;
      }
      function Sd(n, e, t) {
        wc(e);
        try {
          const r = n.viewQuery;
          null !== r && kd(1, r, t);
          const i = n.template;
          null !== i && T_(n, e, i, 1, t),
            n.firstCreatePass && (n.firstCreatePass = !1),
            n.staticContentQueries && M_(n, e),
            n.staticViewQueries && kd(2, n.viewQuery, t);
          const o = n.components;
          null !== o &&
            (function MT(n, e) {
              for (let t = 0; t < e.length; t++) KT(n, e[t]);
            })(e, o);
        } catch (r) {
          throw (
            (n.firstCreatePass &&
              ((n.incompleteFirstPass = !0), (n.firstCreatePass = !1)),
            r)
          );
        } finally {
          (e[2] &= -5), Sc();
        }
      }
      function ul(n, e, t, r) {
        const i = e[2];
        if (128 != (128 & i)) {
          wc(e);
          try {
            wg(e),
              (function Ag(n) {
                return (Z.lFrame.bindingIndex = n);
              })(n.bindingStartIndex),
              null !== t && T_(n, e, t, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const u = n.preOrderCheckHooks;
              null !== u && Ua(e, u, null);
            } else {
              const u = n.preOrderHooks;
              null !== u && Ba(e, u, 0, null), Mc(e, 0);
            }
            if (
              ((function qT(n) {
                for (let e = Wc(n); null !== e; e = Kc(e)) {
                  if (!e[2]) continue;
                  const t = e[9];
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    512 & i[2] || yc(i[3], 1), (i[2] |= 512);
                  }
                }
              })(e),
              (function zT(n) {
                for (let e = Wc(n); null !== e; e = Kc(e))
                  for (let t = 10; t < e.length; t++) {
                    const r = e[t],
                      i = r[1];
                    Va(r) && ul(i, r, i.template, r[8]);
                  }
              })(e),
              null !== n.contentQueries && M_(n, e),
              s)
            ) {
              const u = n.contentCheckHooks;
              null !== u && Ua(e, u);
            } else {
              const u = n.contentHooks;
              null !== u && Ba(e, u, 1), Mc(e, 1);
            }
            !(function wT(n, e) {
              const t = n.hostBindingOpCodes;
              if (null !== t)
                try {
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    if (i < 0) qr(~i);
                    else {
                      const o = i,
                        s = t[++r],
                        a = t[++r];
                      MS(s, o), a(2, e[o]);
                    }
                  }
                } finally {
                  qr(-1);
                }
            })(n, e);
            const a = n.components;
            null !== a &&
              (function ST(n, e) {
                for (let t = 0; t < e.length; t++) WT(n, e[t]);
              })(e, a);
            const l = n.viewQuery;
            if ((null !== l && kd(2, l, r), s)) {
              const u = n.viewCheckHooks;
              null !== u && Ua(e, u);
            } else {
              const u = n.viewHooks;
              null !== u && Ba(e, u, 2), Mc(e, 2);
            }
            !0 === n.firstUpdatePass && (n.firstUpdatePass = !1),
              (e[2] &= -41),
              512 & e[2] && ((e[2] &= -513), yc(e[3], -1));
          } finally {
            Sc();
          }
        }
      }
      function T_(n, e, t, r, i) {
        const o = Et(),
          s = 2 & r;
        try {
          qr(-1), s && e.length > 22 && h_(n, e, 22, !1), t(r, i);
        } finally {
          qr(o);
        }
      }
      function Md(n, e, t) {
        if (mc(e)) {
          const i = e.directiveEnd;
          for (let o = e.directiveStart; o < i; o++) {
            const s = n.data[o];
            s.contentQueries && s.contentQueries(1, t[o], o);
          }
        }
      }
      function Td(n, e, t) {
        Mg() &&
          ((function kT(n, e, t, r) {
            const i = t.directiveStart,
              o = t.directiveEnd;
            Oo(t) &&
              (function jT(n, e, t) {
                const r = Lt(e, n),
                  i = I_(t),
                  o = n[10],
                  s = cl(
                    n,
                    ll(
                      n,
                      i,
                      null,
                      t.onPush ? 32 : 16,
                      r,
                      e,
                      o,
                      o.createRenderer(r, t),
                      null,
                      null,
                      null
                    )
                  );
                n[e.index] = s;
              })(e, t, n.data[i + t.componentOffset]),
              n.firstCreatePass || za(t, e),
              ht(r, e);
            const s = t.initialInputs;
            for (let a = i; a < o; a++) {
              const l = n.data[a],
                u = Wr(e, n, a, t);
              ht(u, e),
                null !== s && HT(0, a - i, u, l, 0, s),
                mn(l) && (Vt(t.index, e)[8] = Wr(e, n, a, t));
            }
          })(n, e, t, Lt(t, e)),
          64 == (64 & t.flags) && P_(n, e, t));
      }
      function Id(n, e, t = Lt) {
        const r = e.localNames;
        if (null !== r) {
          let i = e.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? t(e, n) : n[s];
            n[i++] = a;
          }
        }
      }
      function I_(n) {
        const e = n.tView;
        return null === e || e.incompleteFirstPass
          ? (n.tView = Ad(
              1,
              null,
              n.template,
              n.decls,
              n.vars,
              n.directiveDefs,
              n.pipeDefs,
              n.viewQuery,
              n.schemas,
              n.consts
            ))
          : e;
      }
      function Ad(n, e, t, r, i, o, s, a, l, u) {
        const c = 22 + r,
          d = c + i,
          p = (function TT(n, e) {
            const t = [];
            for (let r = 0; r < e; r++) t.push(r < n ? null : J);
            return t;
          })(c, d),
          g = "function" == typeof u ? u() : u;
        return (p[1] = {
          type: n,
          blueprint: p,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: e,
          data: p.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: g,
          incompleteFirstPass: !1,
        });
      }
      function A_(n, e, t, r) {
        const i = O_(e);
        null === t
          ? i.push(r)
          : (i.push(t), n.firstCreatePass && L_(n).push(r, i.length - 1));
      }
      function x_(n, e, t, r) {
        for (let i in n)
          if (n.hasOwnProperty(i)) {
            t = null === t ? {} : t;
            const o = n[i];
            null === r
              ? R_(t, e, i, o)
              : r.hasOwnProperty(i) && R_(t, e, r[i], o);
          }
        return t;
      }
      function R_(n, e, t, r) {
        n.hasOwnProperty(t) ? n[t].push(e, r) : (n[t] = [e, r]);
      }
      function N_(n, e) {
        const t = Vt(e, n);
        16 & t[2] || (t[2] |= 32);
      }
      function xd(n, e, t, r) {
        let i = !1;
        if (Mg()) {
          const o = null === r ? null : { "": -1 },
            s = (function LT(n, e) {
              const t = n.directiveRegistry;
              let r = null,
                i = null;
              if (t)
                for (let o = 0; o < t.length; o++) {
                  const s = t[o];
                  if (d_(e, s.selectors, !1))
                    if ((r || (r = []), mn(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          s.findHostDirectiveDefs(s, a, i),
                          r.unshift(...a, s),
                          Rd(n, e, a.length);
                      } else r.unshift(s), Rd(n, e, 0);
                    else
                      (i = i || new Map()),
                        s.findHostDirectiveDefs?.(s, r, i),
                        r.push(s);
                }
              return null === r ? null : [r, i];
            })(n, t);
          let a, l;
          null === s ? (a = l = null) : ([a, l] = s),
            null !== a && ((i = !0), F_(n, e, t, a, o, l)),
            o &&
              (function VT(n, e, t) {
                if (e) {
                  const r = (n.localNames = []);
                  for (let i = 0; i < e.length; i += 2) {
                    const o = t[e[i + 1]];
                    if (null == o) throw new T(-301, !1);
                    r.push(e[i], o);
                  }
                }
              })(t, r, o);
        }
        return (t.mergedAttrs = $o(t.mergedAttrs, t.attrs)), i;
      }
      function F_(n, e, t, r, i, o) {
        for (let u = 0; u < r.length; u++) Nc(za(t, e), n, r[u].type);
        !(function UT(n, e, t) {
          (n.flags |= 1),
            (n.directiveStart = e),
            (n.directiveEnd = e + t),
            (n.providerIndexes = e);
        })(t, n.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = ns(n, e, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (t.mergedAttrs = $o(t.mergedAttrs, c.hostAttrs)),
            BT(n, t, e, l, c),
            $T(l, c, i),
            null !== c.contentQueries && (t.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (t.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((n.preOrderHooks || (n.preOrderHooks = [])).push(t.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(
                t.index
              ),
              (a = !0)),
            l++;
        }
        !(function xT(n, e, t) {
          const i = e.directiveEnd,
            o = n.data,
            s = e.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = e.directiveStart; c < i; c++) {
            const d = o[c],
              p = t ? t.get(d) : null,
              m = p ? p.outputs : null;
            (l = x_(d.inputs, c, l, p ? p.inputs : null)),
              (u = x_(d.outputs, c, u, m));
            const C = null === l || null === s || c_(e) ? null : GT(l, c, s);
            a.push(C);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (e.flags |= 8),
            l.hasOwnProperty("style") && (e.flags |= 16)),
            (e.initialInputs = a),
            (e.inputs = l),
            (e.outputs = u);
        })(n, t, o);
      }
      function P_(n, e, t) {
        const r = t.directiveStart,
          i = t.directiveEnd,
          o = t.index,
          s = (function TS() {
            return Z.lFrame.currentDirectiveIndex;
          })();
        try {
          qr(o);
          for (let a = r; a < i; a++) {
            const l = n.data[a],
              u = e[a];
            Dc(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                OT(l, u);
          }
        } finally {
          qr(-1), Dc(s);
        }
      }
      function OT(n, e) {
        null !== n.hostBindings && n.hostBindings(1, e);
      }
      function Rd(n, e, t) {
        (e.componentOffset = t),
          (n.components || (n.components = [])).push(e.index);
      }
      function $T(n, e, t) {
        if (t) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) t[e.exportAs[r]] = n;
          mn(e) && (t[""] = n);
        }
      }
      function BT(n, e, t, r, i) {
        n.data[r] = i;
        const o = i.factory || (i.factory = zr(i.type)),
          s = new Vo(o, mn(i), M);
        (n.blueprint[r] = s),
          (t[r] = s),
          (function FT(n, e, t, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = n.hostBindingOpCodes;
              null === s && (s = n.hostBindingOpCodes = []);
              const a = ~e.index;
              (function PT(n) {
                let e = n.length;
                for (; e > 0; ) {
                  const t = n[--e];
                  if ("number" == typeof t && t < 0) return t;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(t, r, o);
            }
          })(n, e, r, ns(n, t, i.hostVars, J), i);
      }
      function Fn(n, e, t, r, i, o) {
        const s = Lt(n, e);
        !(function Nd(n, e, t, r, i, o, s) {
          if (null == o) n.removeAttribute(e, i, t);
          else {
            const a = null == s ? X(o) : s(o, r || "", i);
            n.setAttribute(e, i, a, t);
          }
        })(e[11], s, o, n.value, t, r, i);
      }
      function HT(n, e, t, r, i, o) {
        const s = o[e];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(t, d, u, c) : (t[c] = d);
          }
        }
      }
      function GT(n, e, t) {
        let r = null,
          i = 0;
        for (; i < t.length; ) {
          const o = t[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (n.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = n[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === e) {
                    r.push(o, s[a + 1], t[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function k_(n, e, t, r) {
        return [n, !0, !1, e, null, 0, r, t, null, null];
      }
      function WT(n, e) {
        const t = Vt(e, n);
        if (Va(t)) {
          const r = t[1];
          48 & t[2] ? ul(r, t, r.template, t[8]) : t[5] > 0 && Fd(t);
        }
      }
      function Fd(n) {
        for (let r = Wc(n); null !== r; r = Kc(r))
          for (let i = 10; i < r.length; i++) {
            const o = r[i];
            if (Va(o))
              if (512 & o[2]) {
                const s = o[1];
                ul(s, o, s.template, o[8]);
              } else o[5] > 0 && Fd(o);
          }
        const t = n[1].components;
        if (null !== t)
          for (let r = 0; r < t.length; r++) {
            const i = Vt(t[r], n);
            Va(i) && i[5] > 0 && Fd(i);
          }
      }
      function KT(n, e) {
        const t = Vt(e, n),
          r = t[1];
        (function QT(n, e) {
          for (let t = e.length; t < n.blueprint.length; t++)
            e.push(n.blueprint[t]);
        })(r, t),
          Sd(r, t, t[8]);
      }
      function cl(n, e) {
        return n[13] ? (n[14][4] = e) : (n[13] = e), (n[14] = e), e;
      }
      function Pd(n) {
        for (; n; ) {
          n[2] |= 32;
          const e = Ko(n);
          if (aS(n) && !e) return n;
          n = e;
        }
        return null;
      }
      function dl(n, e, t, r = !0) {
        const i = e[10];
        i.begin && i.begin();
        try {
          ul(n, e, n.template, t);
        } catch (s) {
          throw (r && $_(e, s), s);
        } finally {
          i.end && i.end();
        }
      }
      function kd(n, e, t) {
        Ec(0), e(n, t);
      }
      function O_(n) {
        return n[7] || (n[7] = []);
      }
      function L_(n) {
        return n.cleanup || (n.cleanup = []);
      }
      function $_(n, e) {
        const t = n[9],
          r = t ? t.get(Li, null) : null;
        r && r.handleError(e);
      }
      function Od(n, e, t, r, i) {
        for (let o = 0; o < t.length; ) {
          const s = t[o++],
            a = t[o++],
            l = e[s],
            u = n.data[s];
          null !== u.setInput ? u.setInput(l, i, r, a) : (l[a] = i);
        }
      }
      function ir(n, e, t) {
        const r = La(e, n);
        !(function Dm(n, e, t) {
          n.setValue(e, t);
        })(n[11], r, t);
      }
      function fl(n, e, t) {
        let r = t ? n.styles : null,
          i = t ? n.classes : null,
          o = 0;
        if (null !== e)
          for (let s = 0; s < e.length; s++) {
            const a = e[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = oc(i, a))
              : 2 == o && (r = oc(r, a + ": " + e[++s] + ";"));
          }
        t ? (n.styles = r) : (n.stylesWithoutHost = r),
          t ? (n.classes = i) : (n.classesWithoutHost = i);
      }
      function hl(n, e, t, r, i = !1) {
        for (; null !== t; ) {
          const o = e[t.index];
          if ((null !== o && r.push(it(o)), gn(o)))
            for (let a = 10; a < o.length; a++) {
              const l = o[a],
                u = l[1].firstChild;
              null !== u && hl(l[1], l, u, r);
            }
          const s = t.type;
          if (8 & s) hl(n, e, t.child, r);
          else if (32 & s) {
            const a = qc(t, e);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Nm(e, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Ko(e[16]);
              hl(l[1], l, a, r, !0);
            }
          }
          t = i ? t.projectionNext : t.next;
        }
        return r;
      }
      class rs {
        get rootNodes() {
          const e = this._lView,
            t = e[1];
          return hl(t, e, t.firstChild, []);
        }
        constructor(e, t) {
          (this._lView = e),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[8];
        }
        set context(e) {
          this._lView[8] = e;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const e = this._lView[3];
            if (gn(e)) {
              const t = e[8],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (Xc(e, r), Ka(t, r));
            }
            this._attachedToViewContainer = !1;
          }
          Em(this._lView[1], this._lView);
        }
        onDestroy(e) {
          A_(this._lView[1], this._lView, null, e);
        }
        markForCheck() {
          Pd(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          dl(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new T(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function L0(n, e) {
              Qo(n, e, e[11], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(e) {
          if (this._attachedToViewContainer) throw new T(902, !1);
          this._appRef = e;
        }
      }
      class YT extends rs {
        constructor(e) {
          super(e), (this._view = e);
        }
        detectChanges() {
          const e = this._view;
          dl(e[1], e, e[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class U_ extends Jo {
        constructor(e) {
          super(), (this.ngModule = e);
        }
        resolveComponentFactory(e) {
          const t = ye(e);
          return new is(t, this.ngModule);
        }
      }
      function B_(n) {
        const e = [];
        for (let t in n)
          n.hasOwnProperty(t) && e.push({ propName: n[t], templateName: t });
        return e;
      }
      class ZT {
        constructor(e, t) {
          (this.injector = e), (this.parentInjector = t);
        }
        get(e, t, r) {
          r = xa(r);
          const i = this.injector.get(e, _d, r);
          return i !== _d || t === _d ? i : this.parentInjector.get(e, t, r);
        }
      }
      class is extends o_ {
        get inputs() {
          return B_(this.componentDef.inputs);
        }
        get outputs() {
          return B_(this.componentDef.outputs);
        }
        constructor(e, t) {
          super(),
            (this.componentDef = e),
            (this.ngModule = t),
            (this.componentType = e.type),
            (this.selector = (function iT(n) {
              return n.map(rT).join(",");
            })(e.selectors)),
            (this.ngContentSelectors = e.ngContentSelectors
              ? e.ngContentSelectors
              : []),
            (this.isBoundToModule = !!t);
        }
        create(e, t, r, i) {
          let o = (i = i || this.ngModule) instanceof Nn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new ZT(e, o) : e,
            a = s.get(es, null);
          if (null === a) throw new T(407, !1);
          const l = s.get(LM, null),
            u = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function IT(n, e, t) {
                  return n.selectRootElement(e, t === hn.ShadowDom);
                })(u, r, this.componentDef.encapsulation)
              : Yc(
                  u,
                  c,
                  (function XT(n) {
                    const e = n.toLowerCase();
                    return "svg" === e ? "svg" : "math" === e ? "math" : null;
                  })(c)
                ),
            p = this.componentDef.onPush ? 288 : 272,
            g = Ad(0, null, null, 1, 0, null, null, null, null, null),
            m = ll(null, g, null, p, null, null, a, u, l, s, null);
          let C, E;
          wc(m);
          try {
            const w = this.componentDef;
            let R,
              S = null;
            w.findHostDirectiveDefs
              ? ((R = []),
                (S = new Map()),
                w.findHostDirectiveDefs(w, R, S),
                R.push(w))
              : (R = [w]);
            const P = (function eI(n, e) {
                const t = n[1];
                return (n[22] = e), Ui(t, 22, 2, "#host", null);
              })(m, d),
              ce = (function tI(n, e, t, r, i, o, s, a) {
                const l = i[1];
                !(function nI(n, e, t, r) {
                  for (const i of n)
                    e.mergedAttrs = $o(e.mergedAttrs, i.hostAttrs);
                  null !== e.mergedAttrs &&
                    (fl(e, e.mergedAttrs, !0), null !== t && km(r, t, e));
                })(r, n, e, s);
                const u = o.createRenderer(e, t),
                  c = ll(
                    i,
                    I_(t),
                    null,
                    t.onPush ? 32 : 16,
                    i[n.index],
                    n,
                    o,
                    u,
                    a || null,
                    null,
                    null
                  );
                return (
                  l.firstCreatePass && Rd(l, n, r.length - 1),
                  cl(i, c),
                  (i[n.index] = c)
                );
              })(P, d, w, R, m, a, u);
            (E = Eg(g, 22)),
              d &&
                (function iI(n, e, t, r) {
                  if (r) Ic(n, t, ["ng-version", VM.full]);
                  else {
                    const { attrs: i, classes: o } = (function oT(n) {
                      const e = [],
                        t = [];
                      let r = 1,
                        i = 2;
                      for (; r < n.length; ) {
                        let o = n[r];
                        if ("string" == typeof o)
                          2 === i
                            ? "" !== o && e.push(o, n[++r])
                            : 8 === i && t.push(o);
                        else {
                          if (!_n(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: e, classes: t };
                    })(e.selectors[0]);
                    i && Ic(n, t, i),
                      o && o.length > 0 && Pm(n, t, o.join(" "));
                  }
                })(u, w, d, r),
              void 0 !== t &&
                (function oI(n, e, t) {
                  const r = (n.projection = []);
                  for (let i = 0; i < e.length; i++) {
                    const o = t[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(E, this.ngContentSelectors, t),
              (C = (function rI(n, e, t, r, i, o) {
                const s = ot(),
                  a = i[1],
                  l = Lt(s, i);
                F_(a, i, s, t, null, r);
                for (let c = 0; c < t.length; c++)
                  ht(Wr(i, a, s.directiveStart + c, s), i);
                P_(a, i, s), l && ht(l, i);
                const u = Wr(i, a, s.directiveStart + s.componentOffset, s);
                if (((n[8] = i[8] = u), null !== o)) for (const c of o) c(u, e);
                return Md(a, s, n), u;
              })(ce, w, R, S, m, [sI])),
              Sd(g, m, null);
          } finally {
            Sc();
          }
          return new JT(this.componentType, C, Oi(E, m), m, E);
        }
      }
      class JT extends RM {
        constructor(e, t, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new YT(i)),
            (this.componentType = e);
        }
        setInput(e, t) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[e])) {
            const o = this._rootLView;
            Od(o[1], o, i, e, t), N_(o, this._tNode.index);
          }
        }
        get injector() {
          return new Ti(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(e) {
          this.hostView.onDestroy(e);
        }
      }
      function sI() {
        const n = ot();
        $a(A()[1], n);
      }
      function ve(n) {
        let e = (function j_(n) {
            return Object.getPrototypeOf(n.prototype).constructor;
          })(n.type),
          t = !0;
        const r = [n];
        for (; e; ) {
          let i;
          if (mn(n)) i = e.ɵcmp || e.ɵdir;
          else {
            if (e.ɵcmp) throw new T(903, !1);
            i = e.ɵdir;
          }
          if (i) {
            if (t) {
              r.push(i);
              const s = n;
              (s.inputs = Ld(n.inputs)),
                (s.declaredInputs = Ld(n.declaredInputs)),
                (s.outputs = Ld(n.outputs));
              const a = i.hostBindings;
              a && cI(n, a);
              const l = i.viewQuery,
                u = i.contentQueries;
              if (
                (l && lI(n, l),
                u && uI(n, u),
                ic(n.inputs, i.inputs),
                ic(n.declaredInputs, i.declaredInputs),
                ic(n.outputs, i.outputs),
                mn(i) && i.data.animation)
              ) {
                const c = n.data;
                c.animation = (c.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(n), a === ve && (t = !1);
              }
          }
          e = Object.getPrototypeOf(e);
        }
        !(function aI(n) {
          let e = 0,
            t = null;
          for (let r = n.length - 1; r >= 0; r--) {
            const i = n[r];
            (i.hostVars = e += i.hostVars),
              (i.hostAttrs = $o(i.hostAttrs, (t = $o(t, i.hostAttrs))));
          }
        })(r);
      }
      function Ld(n) {
        return n === Yn ? {} : n === ge ? [] : n;
      }
      function lI(n, e) {
        const t = n.viewQuery;
        n.viewQuery = t
          ? (r, i) => {
              e(r, i), t(r, i);
            }
          : e;
      }
      function uI(n, e) {
        const t = n.contentQueries;
        n.contentQueries = t
          ? (r, i, o) => {
              e(r, i, o), t(r, i, o);
            }
          : e;
      }
      function cI(n, e) {
        const t = n.hostBindings;
        n.hostBindings = t
          ? (r, i) => {
              e(r, i), t(r, i);
            }
          : e;
      }
      let pl = null;
      function Zr() {
        if (!pl) {
          const n = Me.Symbol;
          if (n && n.iterator) pl = n.iterator;
          else {
            const e = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < e.length; ++t) {
              const r = e[t];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (pl = r);
            }
          }
        }
        return pl;
      }
      function gl(n) {
        return (
          !!(function Vd(n) {
            return (
              null !== n && ("function" == typeof n || "object" == typeof n)
            );
          })(n) &&
          (Array.isArray(n) || (!(n instanceof Map) && Zr() in n))
        );
      }
      function pt(n, e, t) {
        return !Object.is(n[e], t) && ((n[e] = t), !0);
      }
      function kn(n, e, t, r) {
        const i = A();
        return pt(i, Si(), e) && (ue(), Fn(Ne(), i, n, e, t, r)), kn;
      }
      function Hi(n, e, t, r, i, o) {
        const a = (function Jr(n, e, t, r) {
          const i = pt(n, e, t);
          return pt(n, e + 1, r) || i;
        })(
          n,
          (function Jn() {
            return Z.lFrame.bindingIndex;
          })(),
          t,
          i
        );
        return er(2), a ? e + X(t) + r + X(i) + o : J;
      }
      function b(n, e, t, r, i, o, s, a) {
        const l = A(),
          u = ue(),
          c = n + 22,
          d = u.firstCreatePass
            ? (function CI(n, e, t, r, i, o, s, a, l) {
                const u = e.consts,
                  c = Ui(e, n, 4, s || null, Dr(u, a));
                xd(e, t, c, Dr(u, l)), $a(e, c);
                const d = (c.tViews = Ad(
                  2,
                  c,
                  r,
                  i,
                  o,
                  e.directiveRegistry,
                  e.pipeRegistry,
                  null,
                  e.schemas,
                  u
                ));
                return (
                  null !== e.queries &&
                    (e.queries.template(e, c),
                    (d.queries = e.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, e, t, r, i, o, s)
            : u.data[c];
        xn(d, !1);
        const p = l[11].createComment("");
        Ja(u, l, p, d),
          ht(p, l),
          cl(l, (l[c] = k_(p, l, p, d))),
          Oa(d) && Td(u, l, d),
          null != s && Id(l, d, a);
      }
      function I(n) {
        return (function wi(n, e) {
          return n[e];
        })(
          (function wS() {
            return Z.lFrame.contextLView;
          })(),
          22 + n
        );
      }
      function v(n, e, t) {
        const r = A();
        return (
          pt(r, Si(), e) &&
            (function Bt(n, e, t, r, i, o, s, a) {
              const l = Lt(e, t);
              let c,
                u = e.inputs;
              !a && null != u && (c = u[r])
                ? (Od(n, t, c, r, i), Oo(e) && N_(t, e.index))
                : 3 & e.type &&
                  ((r = (function RT(n) {
                    return "class" === n
                      ? "className"
                      : "for" === n
                      ? "htmlFor"
                      : "formaction" === n
                      ? "formAction"
                      : "innerHtml" === n
                      ? "innerHTML"
                      : "readonly" === n
                      ? "readOnly"
                      : "tabindex" === n
                      ? "tabIndex"
                      : n;
                  })(r)),
                  (i = null != s ? s(i, e.value || "", r) : i),
                  o.setProperty(l, r, i));
            })(ue(), Ne(), r, n, e, r[11], t, !1),
          v
        );
      }
      function $d(n, e, t, r, i) {
        const s = i ? "class" : "style";
        Od(n, t, e.inputs[s], s, r);
      }
      function h(n, e, t, r) {
        const i = A(),
          o = ue(),
          s = 22 + n,
          a = i[11],
          l = (i[s] = Yc(
            a,
            e,
            (function kS() {
              return Z.lFrame.currentNamespace;
            })()
          )),
          u = o.firstCreatePass
            ? (function bI(n, e, t, r, i, o, s) {
                const a = e.consts,
                  u = Ui(e, n, 2, i, Dr(a, o));
                return (
                  xd(e, t, u, Dr(a, s)),
                  null !== u.attrs && fl(u, u.attrs, !1),
                  null !== u.mergedAttrs && fl(u, u.mergedAttrs, !0),
                  null !== e.queries && e.queries.elementStart(e, u),
                  u
                );
              })(s, o, i, 0, e, t, r)
            : o.data[s];
        return (
          xn(u, !0),
          km(a, l, u),
          32 != (32 & u.flags) && Ja(o, i, l, u),
          0 ===
            (function vS() {
              return Z.lFrame.elementDepthCount;
            })() && ht(l, i),
          (function CS() {
            Z.lFrame.elementDepthCount++;
          })(),
          Oa(u) && (Td(o, i, u), Md(o, u, i)),
          null !== r && Id(i, u),
          h
        );
      }
      function f() {
        let n = ot();
        vc()
          ? (function Cc() {
              Z.lFrame.isParent = !1;
            })()
          : ((n = n.parent), xn(n, !1));
        const e = n;
        !(function DS() {
          Z.lFrame.elementDepthCount--;
        })();
        const t = ue();
        return (
          t.firstCreatePass && ($a(t, n), mc(n) && t.queries.elementEnd(n)),
          null != e.classesWithoutHost &&
            (function $S(n) {
              return 0 != (8 & n.flags);
            })(e) &&
            $d(t, e, A(), e.classesWithoutHost, !0),
          null != e.stylesWithoutHost &&
            (function US(n) {
              return 0 != (16 & n.flags);
            })(e) &&
            $d(t, e, A(), e.stylesWithoutHost, !1),
          f
        );
      }
      function B(n, e, t, r) {
        return h(n, e, t, r), f(), B;
      }
      function se() {
        return A();
      }
      function ss(n) {
        return !!n && "function" == typeof n.then;
      }
      const jd = function ny(n) {
        return !!n && "function" == typeof n.subscribe;
      };
      function x(n, e, t, r) {
        const i = A(),
          o = ue(),
          s = ot();
        return (
          (function iy(n, e, t, r, i, o, s) {
            const a = Oa(r),
              u = n.firstCreatePass && L_(n),
              c = e[8],
              d = O_(e);
            let p = !0;
            if (3 & r.type || s) {
              const C = Lt(r, e),
                E = s ? s(C) : C,
                w = d.length,
                R = s ? (P) => s(it(P[r.index])) : r.index;
              let S = null;
              if (
                (!s &&
                  a &&
                  (S = (function wI(n, e, t, r) {
                    const i = n.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === t && i[o + 1] === r) {
                          const a = e[7],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(n, e, i, r.index)),
                null !== S)
              )
                ((S.__ngLastListenerFn__ || S).__ngNextListenerFn__ = o),
                  (S.__ngLastListenerFn__ = o),
                  (p = !1);
              else {
                o = sy(r, e, c, o, !1);
                const P = t.listen(E, i, o);
                d.push(o, P), u && u.push(i, R, w, w + 1);
              }
            } else o = sy(r, e, c, o, !1);
            const g = r.outputs;
            let m;
            if (p && null !== g && (m = g[i])) {
              const C = m.length;
              if (C)
                for (let E = 0; E < C; E += 2) {
                  const ce = e[m[E]][m[E + 1]].subscribe(o),
                    pe = d.length;
                  d.push(o, ce), u && u.push(i, r.index, pe, -(pe + 1));
                }
            }
          })(o, i, i[11], s, n, e, r),
          x
        );
      }
      function oy(n, e, t, r) {
        try {
          return !1 !== t(r);
        } catch (i) {
          return $_(n, i), !1;
        }
      }
      function sy(n, e, t, r, i) {
        return function o(s) {
          if (s === Function) return r;
          Pd(n.componentOffset > -1 ? Vt(n.index, e) : e);
          let l = oy(e, 0, r, s),
            u = o.__ngNextListenerFn__;
          for (; u; ) (l = oy(e, 0, u, s) && l), (u = u.__ngNextListenerFn__);
          return i && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function D(n = 1) {
        return (function AS(n) {
          return (Z.lFrame.contextLView = (function xS(n, e) {
            for (; n > 0; ) (e = e[15]), n--;
            return e;
          })(n, Z.lFrame.contextLView))[8];
        })(n);
      }
      function _l(n, e) {
        return (n << 17) | (e << 2);
      }
      function Er(n) {
        return (n >> 17) & 32767;
      }
      function Gd(n) {
        return 2 | n;
      }
      function ei(n) {
        return (131068 & n) >> 2;
      }
      function zd(n, e) {
        return (-131069 & n) | (e << 2);
      }
      function qd(n) {
        return 1 | n;
      }
      function my(n, e, t, r, i) {
        const o = n[t + 1],
          s = null === e;
        let a = r ? Er(o) : ei(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = n[a + 1];
          FI(n[a], e) && ((l = !0), (n[a + 1] = r ? qd(c) : Gd(c))),
            (a = r ? Er(c) : ei(c));
        }
        l && (n[t + 1] = r ? Gd(o) : qd(o));
      }
      function FI(n, e) {
        return (
          null === n ||
          null == e ||
          (Array.isArray(n) ? n[1] : n) === e ||
          (!(!Array.isArray(n) || "string" != typeof e) && Ni(n, e) >= 0)
        );
      }
      function be(n, e) {
        return (
          (function yn(n, e, t, r) {
            const i = A(),
              o = ue(),
              s = er(2);
            o.firstUpdatePass &&
              (function Sy(n, e, t, r) {
                const i = n.data;
                if (null === i[t + 1]) {
                  const o = i[Et()],
                    s = (function wy(n, e) {
                      return e >= n.expandoStartIndex;
                    })(n, t);
                  (function Ay(n, e) {
                    return 0 != (n.flags & (e ? 8 : 16));
                  })(o, r) &&
                    null === e &&
                    !s &&
                    (e = !1),
                    (e = (function jI(n, e, t, r) {
                      const i = (function bc(n) {
                        const e = Z.lFrame.currentDirectiveIndex;
                        return -1 === e ? null : n[e];
                      })(n);
                      let o = r ? e.residualClasses : e.residualStyles;
                      if (null === i)
                        0 === (r ? e.classBindings : e.styleBindings) &&
                          ((t = as((t = Wd(null, n, e, t, r)), e.attrs, r)),
                          (o = null));
                      else {
                        const s = e.directiveStylingLast;
                        if (-1 === s || n[s] !== i)
                          if (((t = Wd(i, n, e, t, r)), null === o)) {
                            let l = (function HI(n, e, t) {
                              const r = t ? e.classBindings : e.styleBindings;
                              if (0 !== ei(r)) return n[Er(r)];
                            })(n, e, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = Wd(null, n, e, l[1], r)),
                              (l = as(l, e.attrs, r)),
                              (function GI(n, e, t, r) {
                                n[Er(t ? e.classBindings : e.styleBindings)] =
                                  r;
                              })(n, e, r, l));
                          } else
                            o = (function zI(n, e, t) {
                              let r;
                              const i = e.directiveEnd;
                              for (
                                let o = 1 + e.directiveStylingLast;
                                o < i;
                                o++
                              )
                                r = as(r, n[o].hostAttrs, t);
                              return as(r, e.attrs, t);
                            })(n, e, r);
                      }
                      return (
                        void 0 !== o &&
                          (r
                            ? (e.residualClasses = o)
                            : (e.residualStyles = o)),
                        t
                      );
                    })(i, o, e, r)),
                    (function RI(n, e, t, r, i, o) {
                      let s = o ? e.classBindings : e.styleBindings,
                        a = Er(s),
                        l = ei(s);
                      n[r] = t;
                      let c,
                        u = !1;
                      if (
                        (Array.isArray(t)
                          ? ((c = t[1]),
                            (null === c || Ni(t, c) > 0) && (u = !0))
                          : (c = t),
                        i)
                      )
                        if (0 !== l) {
                          const p = Er(n[a + 1]);
                          (n[r + 1] = _l(p, a)),
                            0 !== p && (n[p + 1] = zd(n[p + 1], r)),
                            (n[a + 1] = (function AI(n, e) {
                              return (131071 & n) | (e << 17);
                            })(n[a + 1], r));
                        } else
                          (n[r + 1] = _l(a, 0)),
                            0 !== a && (n[a + 1] = zd(n[a + 1], r)),
                            (a = r);
                      else
                        (n[r + 1] = _l(l, 0)),
                          0 === a ? (a = r) : (n[l + 1] = zd(n[l + 1], r)),
                          (l = r);
                      u && (n[r + 1] = Gd(n[r + 1])),
                        my(n, c, r, !0),
                        my(n, c, r, !1),
                        (function NI(n, e, t, r, i) {
                          const o = i ? n.residualClasses : n.residualStyles;
                          null != o &&
                            "string" == typeof e &&
                            Ni(o, e) >= 0 &&
                            (t[r + 1] = qd(t[r + 1]));
                        })(e, c, n, r, o),
                        (s = _l(a, l)),
                        o ? (e.classBindings = s) : (e.styleBindings = s);
                    })(i, o, e, t, s, r);
                }
              })(o, n, s, r),
              e !== J &&
                pt(i, s, e) &&
                (function Ty(n, e, t, r, i, o, s, a) {
                  if (!(3 & e.type)) return;
                  const l = n.data,
                    u = l[a + 1],
                    c = (function xI(n) {
                      return 1 == (1 & n);
                    })(u)
                      ? Iy(l, e, t, i, ei(u), s)
                      : void 0;
                  yl(c) ||
                    (yl(o) ||
                      ((function II(n) {
                        return 2 == (2 & n);
                      })(u) &&
                        (o = Iy(l, null, t, i, a, s))),
                    (function W0(n, e, t, r, i) {
                      if (e) i ? n.addClass(t, r) : n.removeClass(t, r);
                      else {
                        let o = -1 === r.indexOf("-") ? void 0 : It.DashCase;
                        null == i
                          ? n.removeStyle(t, r, o)
                          : ("string" == typeof i &&
                              i.endsWith("!important") &&
                              ((i = i.slice(0, -10)), (o |= It.Important)),
                            n.setStyle(t, r, i, o));
                      }
                    })(r, s, La(Et(), t), i, o));
                })(
                  o,
                  o.data[Et()],
                  i,
                  i[11],
                  n,
                  (i[s + 1] = (function KI(n, e) {
                    return (
                      null == n ||
                        ("string" == typeof e
                          ? (n += e)
                          : "object" == typeof n && (n = we(br(n)))),
                      n
                    );
                  })(e, t)),
                  r,
                  s
                );
          })(n, e, null, !0),
          be
        );
      }
      function Wd(n, e, t, r, i) {
        let o = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (
          -1 === a ? (a = t.directiveStart) : a++;
          a < s && ((o = e[a]), (r = as(r, o.hostAttrs, i)), o !== n);

        )
          a++;
        return null !== n && (t.directiveStylingLast = a), r;
      }
      function as(n, e, t) {
        const r = t ? 1 : 2;
        let i = -1;
        if (null !== e)
          for (let o = 0; o < e.length; o++) {
            const s = e[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(n) || (n = void 0 === n ? [] : ["", n]),
                $t(n, s, !!t || e[++o]));
          }
        return void 0 === n ? null : n;
      }
      function Iy(n, e, t, r, i, o) {
        const s = null === e;
        let a;
        for (; i > 0; ) {
          const l = n[i],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let p = t[i + 1];
          p === J && (p = d ? ge : void 0);
          let g = d ? Oc(p, r) : c === r ? p : void 0;
          if ((u && !yl(g) && (g = Oc(l, r)), yl(g) && ((a = g), s))) return a;
          const m = n[i + 1];
          i = s ? Er(m) : ei(m);
        }
        if (null !== e) {
          let l = o ? e.residualClasses : e.residualStyles;
          null != l && (a = Oc(l, r));
        }
        return a;
      }
      function yl(n) {
        return void 0 !== n;
      }
      function _(n, e = "") {
        const t = A(),
          r = ue(),
          i = n + 22,
          o = r.firstCreatePass ? Ui(r, i, 1, e, null) : r.data[i],
          s = (t[i] = (function Qc(n, e) {
            return n.createText(e);
          })(t[11], e));
        Ja(r, t, s, o), xn(o, !1);
      }
      function de(n) {
        return Fe("", n, ""), de;
      }
      function Fe(n, e, t) {
        const r = A(),
          i = (function ji(n, e, t, r) {
            return pt(n, Si(), t) ? e + X(t) + r : J;
          })(r, n, e, t);
        return i !== J && ir(r, Et(), i), Fe;
      }
      function wr(n, e, t, r, i) {
        const o = A(),
          s = Hi(o, n, e, t, r, i);
        return s !== J && ir(o, Et(), s), wr;
      }
      const Zi = "en-US";
      let Yy = Zi;
      function Yd(n, e, t, r, i) {
        if (((n = z(n)), Array.isArray(n)))
          for (let o = 0; o < n.length; o++) Yd(n[o], e, t, r, i);
        else {
          const o = ue(),
            s = A();
          let a = Xr(n) ? n : z(n.provide),
            l = i_(n);
          const u = ot(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            p = u.providerIndexes >> 20;
          if (Xr(n) || !n.multi) {
            const g = new Vo(l, i, M),
              m = Zd(a, e, i ? c : c + p, d);
            -1 === m
              ? (Nc(za(u, s), o, a),
                Xd(o, n, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                t.push(g),
                s.push(g))
              : ((t[m] = g), (s[m] = g));
          } else {
            const g = Zd(a, e, c + p, d),
              m = Zd(a, e, c, c + p),
              E = m >= 0 && t[m];
            if ((i && !E) || (!i && !(g >= 0 && t[g]))) {
              Nc(za(u, s), o, a);
              const w = (function fx(n, e, t, r, i) {
                const o = new Vo(n, t, M);
                return (
                  (o.multi = []),
                  (o.index = e),
                  (o.componentProviders = 0),
                  Dv(o, i, r && !t),
                  o
                );
              })(i ? dx : cx, t.length, i, r, l);
              !i && E && (t[m].providerFactory = w),
                Xd(o, n, e.length, 0),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                t.push(w),
                s.push(w);
            } else Xd(o, n, g > -1 ? g : m, Dv(t[i ? m : g], l, !i && r));
            !i && r && E && t[m].componentProviders++;
          }
        }
      }
      function Xd(n, e, t, r) {
        const i = Xr(e),
          o = (function wM(n) {
            return !!n.useClass;
          })(e);
        if (i || o) {
          const l = (o ? z(e.useClass) : e).prototype.ngOnDestroy;
          if (l) {
            const u = n.destroyHooks || (n.destroyHooks = []);
            if (!i && e.multi) {
              const c = u.indexOf(t);
              -1 === c ? u.push(t, [r, l]) : u[c + 1].push(r, l);
            } else u.push(t, l);
          }
        }
      }
      function Dv(n, e, t) {
        return t && n.componentProviders++, n.multi.push(e) - 1;
      }
      function Zd(n, e, t, r) {
        for (let i = t; i < r; i++) if (e[i] === n) return i;
        return -1;
      }
      function cx(n, e, t, r) {
        return Jd(this.multi, []);
      }
      function dx(n, e, t, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Wr(t, t[1], this.providerFactory.index, r);
          (o = a.slice(0, s)), Jd(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), Jd(i, o);
        return o;
      }
      function Jd(n, e) {
        for (let t = 0; t < n.length; t++) e.push((0, n[t])());
        return e;
      }
      function Re(n, e = []) {
        return (t) => {
          t.providersResolver = (r, i) =>
            (function ux(n, e, t) {
              const r = ue();
              if (r.firstCreatePass) {
                const i = mn(n);
                Yd(t, r.data, r.blueprint, i, !0),
                  Yd(e, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(n) : n, e);
        };
      }
      class Ji {}
      class bv {}
      class Ev extends Ji {
        constructor(e, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new U_(this));
          const r = kt(e);
          (this._bootstrapComponents = rr(r.bootstrap)),
            (this._r3Injector = y_(
              e,
              t,
              [
                { provide: Ji, useValue: this },
                { provide: Jo, useValue: this.componentFactoryResolver },
              ],
              we(e),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(e));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(),
            this.destroyCbs.forEach((t) => t()),
            (this.destroyCbs = null);
        }
        onDestroy(e) {
          this.destroyCbs.push(e);
        }
      }
      class ef extends bv {
        constructor(e) {
          super(), (this.moduleType = e);
        }
        create(e) {
          return new Ev(this.moduleType, e);
        }
      }
      class px extends Ji {
        constructor(e, t, r) {
          super(),
            (this.componentFactoryResolver = new U_(this)),
            (this.instance = null);
          const i = new r_(
            [
              ...e,
              { provide: Ji, useValue: this },
              { provide: Jo, useValue: this.componentFactoryResolver },
            ],
            t || sl(),
            r,
            new Set(["environment"])
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(e) {
          this.injector.onDestroy(e);
        }
      }
      function El(n, e, t = null) {
        return new px(n, e, t).injector;
      }
      let gx = (() => {
        class n {
          constructor(t) {
            (this._injector = t), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(t) {
            if (!t.standalone) return null;
            if (!this.cachedInjectors.has(t.id)) {
              const r = Jm(0, t.type),
                i =
                  r.length > 0
                    ? El([r], this._injector, `Standalone[${t.type.name}]`)
                    : null;
              this.cachedInjectors.set(t.id, i);
            }
            return this.cachedInjectors.get(t.id);
          }
          ngOnDestroy() {
            try {
              for (const t of this.cachedInjectors.values())
                null !== t && t.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (n.ɵprov = O({
            token: n,
            providedIn: "environment",
            factory: () => new n(N(Nn)),
          })),
          n
        );
      })();
      function wv(n) {
        n.getStandaloneInjector = (e) =>
          e.get(gx).getOrCreateStandaloneInjector(n);
      }
      function nf(n) {
        return (e) => {
          setTimeout(n, void 0, e);
        };
      }
      const he = class Bx extends Nt {
        constructor(e = !1) {
          super(), (this.__isAsync = e);
        }
        emit(e) {
          super.next(e);
        }
        subscribe(e, t, r) {
          let i = e,
            o = t || (() => null),
            s = r;
          if (e && "object" == typeof e) {
            const l = e;
            (i = l.next?.bind(l)),
              (o = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = nf(o)), i && (i = nf(i)), s && (s = nf(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return e instanceof qt && e.add(a), a;
        }
      };
      function jx() {
        return this._results[Zr()]();
      }
      class rf {
        get changes() {
          return this._changes || (this._changes = new he());
        }
        constructor(e = !1) {
          (this._emitDistinctChangesOnly = e),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = Zr(),
            r = rf.prototype;
          r[t] || (r[t] = jx);
        }
        get(e) {
          return this._results[e];
        }
        map(e) {
          return this._results.map(e);
        }
        filter(e) {
          return this._results.filter(e);
        }
        find(e) {
          return this._results.find(e);
        }
        reduce(e, t) {
          return this._results.reduce(e, t);
        }
        forEach(e) {
          this._results.forEach(e);
        }
        some(e) {
          return this._results.some(e);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(e, t) {
          const r = this;
          r.dirty = !1;
          const i = (function Zt(n) {
            return n.flat(Number.POSITIVE_INFINITY);
          })(e);
          (this._changesDetected = !(function YS(n, e, t) {
            if (n.length !== e.length) return !1;
            for (let r = 0; r < n.length; r++) {
              let i = n[r],
                o = e[r];
              if ((t && ((i = t(i)), (o = t(o))), o !== i)) return !1;
            }
            return !0;
          })(r._results, i, t)) &&
            ((r._results = i),
            (r.length = i.length),
            (r.last = i[this.length - 1]),
            (r.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let or = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = zx), n;
      })();
      const Hx = or,
        Gx = class extends Hx {
          constructor(e, t, r) {
            super(),
              (this._declarationLView = e),
              (this._declarationTContainer = t),
              (this.elementRef = r);
          }
          createEmbeddedView(e, t) {
            const r = this._declarationTContainer.tViews,
              i = ll(
                this._declarationLView,
                r,
                e,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                t || null
              );
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (i[19] = s.createEmbeddedView(r)),
              Sd(r, i, e),
              new rs(i)
            );
          }
        };
      function zx() {
        return wl(ot(), A());
      }
      function wl(n, e) {
        return 4 & n.type ? new Gx(e, n, Oi(n, e)) : null;
      }
      let Cn = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = qx), n;
      })();
      function qx() {
        return Vv(ot(), A());
      }
      const Wx = Cn,
        Ov = class extends Wx {
          constructor(e, t, r) {
            super(),
              (this._lContainer = e),
              (this._hostTNode = t),
              (this._hostLView = r);
          }
          get element() {
            return Oi(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Ti(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const e = Rc(this._hostTNode, this._hostLView);
            if (Bg(e)) {
              const t = Ha(e, this._hostLView),
                r = ja(e);
              return new Ti(t[1].data[r + 8], t);
            }
            return new Ti(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(e) {
            const t = Lv(this._lContainer);
            return (null !== t && t[e]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(e, t, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const s = e.createEmbeddedView(t || {}, o);
            return this.insert(s, i), s;
          }
          createComponent(e, t, r, i, o) {
            const s =
              e &&
              !(function Bo(n) {
                return "function" == typeof n;
              })(e);
            let a;
            if (s) a = t;
            else {
              const d = t || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (o = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? e : new is(ye(e)),
              u = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const p = (s ? u : this.parentInjector).get(Nn, null);
              p && (o = p);
            }
            const c = l.create(u, i, void 0, o);
            return this.insert(c.hostView, a), c;
          }
          insert(e, t) {
            const r = e._lView,
              i = r[1];
            if (
              (function yS(n) {
                return gn(n[3]);
              })(r)
            ) {
              const c = this.indexOf(e);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  p = new Ov(d, d[6], d[3]);
                p.detach(p.indexOf(e));
              }
            }
            const o = this._adjustIndex(t),
              s = this._lContainer;
            !(function $0(n, e, t, r) {
              const i = 10 + r,
                o = t.length;
              r > 0 && (t[i - 1][4] = e),
                r < o - 10
                  ? ((e[4] = t[i]), Jg(t, 10 + r, e))
                  : (t.push(e), (e[4] = null)),
                (e[3] = t);
              const s = e[17];
              null !== s &&
                t !== s &&
                (function U0(n, e) {
                  const t = n[9];
                  e[16] !== e[3][3][16] && (n[2] = !0),
                    null === t ? (n[9] = [e]) : t.push(e);
                })(s, e);
              const a = e[19];
              null !== a && a.insertView(n), (e[2] |= 64);
            })(i, r, s, o);
            const a = ed(o, s),
              l = r[11],
              u = Za(l, s[7]);
            return (
              null !== u &&
                (function O0(n, e, t, r, i, o) {
                  (r[0] = i), (r[6] = e), Qo(n, r, t, 1, i, o);
                })(i, s[6], l, r, u, a),
              e.attachToViewContainerRef(),
              Jg(sf(s), o, e),
              e
            );
          }
          move(e, t) {
            return this.insert(e, t);
          }
          indexOf(e) {
            const t = Lv(this._lContainer);
            return null !== t ? t.indexOf(e) : -1;
          }
          remove(e) {
            const t = this._adjustIndex(e, -1),
              r = Xc(this._lContainer, t);
            r && (Ka(sf(this._lContainer), t), Em(r[1], r));
          }
          detach(e) {
            const t = this._adjustIndex(e, -1),
              r = Xc(this._lContainer, t);
            return r && null != Ka(sf(this._lContainer), t) ? new rs(r) : null;
          }
          _adjustIndex(e, t = 0) {
            return e ?? this.length + t;
          }
        };
      function Lv(n) {
        return n[8];
      }
      function sf(n) {
        return n[8] || (n[8] = []);
      }
      function Vv(n, e) {
        let t;
        const r = e[n.index];
        if (gn(r)) t = r;
        else {
          let i;
          if (8 & n.type) i = it(r);
          else {
            const o = e[11];
            i = o.createComment("");
            const s = Lt(n, e);
            Qr(
              o,
              Za(o, s),
              i,
              (function G0(n, e) {
                return n.nextSibling(e);
              })(o, s),
              !1
            );
          }
          (e[n.index] = t = k_(r, e, i, n)), cl(e, t);
        }
        return new Ov(t, n, e);
      }
      class af {
        constructor(e) {
          (this.queryList = e), (this.matches = null);
        }
        clone() {
          return new af(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class lf {
        constructor(e = []) {
          this.queries = e;
        }
        createEmbeddedView(e) {
          const t = e.queries;
          if (null !== t) {
            const r =
                null !== e.contentQueries ? e.contentQueries[0] : t.length,
              i = [];
            for (let o = 0; o < r; o++) {
              const s = t.getByIndex(o);
              i.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new lf(i);
          }
          return null;
        }
        insertView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        detachView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        dirtyQueriesWithMatches(e) {
          for (let t = 0; t < this.queries.length; t++)
            null !== qv(e, t).matches && this.queries[t].setDirty();
        }
      }
      class $v {
        constructor(e, t, r = null) {
          (this.predicate = e), (this.flags = t), (this.read = r);
        }
      }
      class uf {
        constructor(e = []) {
          this.queries = e;
        }
        elementStart(e, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(e, t);
        }
        elementEnd(e) {
          for (let t = 0; t < this.queries.length; t++)
            this.queries[t].elementEnd(e);
        }
        embeddedTView(e) {
          let t = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== t ? t.length : 0,
              o = this.getByIndex(r).embeddedTView(e, i);
            o &&
              ((o.indexInDeclarationView = r),
              null !== t ? t.push(o) : (t = [o]));
          }
          return null !== t ? new uf(t) : null;
        }
        template(e, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(e, t);
        }
        getByIndex(e) {
          return this.queries[e];
        }
        get length() {
          return this.queries.length;
        }
        track(e) {
          this.queries.push(e);
        }
      }
      class cf {
        constructor(e, t = -1) {
          (this.metadata = e),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(e, t) {
          this.isApplyingToNode(t) && this.matchTNode(e, t);
        }
        elementEnd(e) {
          this._declarationNodeIndex === e.index &&
            (this._appliesToNextNode = !1);
        }
        template(e, t) {
          this.elementStart(e, t);
        }
        embeddedTView(e, t) {
          return this.isApplyingToNode(e)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-e.index, t),
              new cf(this.metadata))
            : null;
        }
        isApplyingToNode(e) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let r = e.parent;
            for (; null !== r && 8 & r.type && r.index !== t; ) r = r.parent;
            return t === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(e, t) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              this.matchTNodeWithReadOption(e, t, Kx(t, o)),
                this.matchTNodeWithReadOption(e, t, qa(t, e, o, !1, !1));
            }
          else
            r === or
              ? 4 & t.type && this.matchTNodeWithReadOption(e, t, -1)
              : this.matchTNodeWithReadOption(e, t, qa(t, e, r, !1, !1));
        }
        matchTNodeWithReadOption(e, t, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === Ut || i === Cn || (i === or && 4 & t.type))
                this.addMatch(t.index, -2);
              else {
                const o = qa(t, e, i, !1, !1);
                null !== o && this.addMatch(t.index, o);
              }
            else this.addMatch(t.index, r);
          }
        }
        addMatch(e, t) {
          null === this.matches
            ? (this.matches = [e, t])
            : this.matches.push(e, t);
        }
      }
      function Kx(n, e) {
        const t = n.localNames;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) if (t[r] === e) return t[r + 1];
        return null;
      }
      function Yx(n, e, t, r) {
        return -1 === t
          ? (function Qx(n, e) {
              return 11 & n.type ? Oi(n, e) : 4 & n.type ? wl(n, e) : null;
            })(e, n)
          : -2 === t
          ? (function Xx(n, e, t) {
              return t === Ut
                ? Oi(e, n)
                : t === or
                ? wl(e, n)
                : t === Cn
                ? Vv(e, n)
                : void 0;
            })(n, e, r)
          : Wr(n, n[1], t, e);
      }
      function Uv(n, e, t, r) {
        const i = e[19].queries[r];
        if (null === i.matches) {
          const o = n.data,
            s = t.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : Yx(e, o[u], s[l + 1], t.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function df(n, e, t, r) {
        const i = n.queries.getByIndex(t),
          o = i.matches;
        if (null !== o) {
          const s = Uv(n, e, i, t);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const u = o[a + 1],
                c = e[-l];
              for (let d = 10; d < c.length; d++) {
                const p = c[d];
                p[17] === p[3] && df(p[1], p, u, r);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let p = 0; p < d.length; p++) {
                  const g = d[p];
                  df(g[1], g, u, r);
                }
              }
            }
          }
        }
        return r;
      }
      function Bv(n) {
        const e = A(),
          t = ue(),
          r = Rg();
        Ec(r + 1);
        const i = qv(t, r);
        if (
          n.dirty &&
          (function _S(n) {
            return 4 == (4 & n[2]);
          })(e) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) n.reset([]);
          else {
            const o = i.crossesNgTemplate ? df(t, e, r, []) : Uv(t, e, i, r);
            n.reset(o, kM), n.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function jv(n, e, t, r) {
        const i = ue();
        if (i.firstCreatePass) {
          const o = ot();
          (function zv(n, e, t) {
            null === n.queries && (n.queries = new uf()),
              n.queries.track(new cf(e, t));
          })(i, new $v(e, t, r), o.index),
            (function eR(n, e) {
              const t = n.contentQueries || (n.contentQueries = []);
              e !== (t.length ? t[t.length - 1] : -1) &&
                t.push(n.queries.length - 1, e);
            })(i, n),
            2 == (2 & t) && (i.staticContentQueries = !0);
        }
        !(function Gv(n, e, t) {
          const r = new rf(4 == (4 & t));
          A_(n, e, r, r.destroy),
            null === e[19] && (e[19] = new lf()),
            e[19].queries.push(new af(r));
        })(i, A(), t);
      }
      function qv(n, e) {
        return n.queries.getByIndex(e);
      }
      function W(n, e) {
        return wl(n, e);
      }
      function Ml(...n) {}
      const Tl = new V("Application Initializer");
      let Il = (() => {
        class n {
          constructor(t) {
            (this.appInits = t),
              (this.resolve = Ml),
              (this.reject = Ml),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (ss(o)) t.push(o);
                else if (jd(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  t.push(s);
                }
              }
            Promise.all(t)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === t.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Tl, 8));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const ms = new V("AppId", {
        providedIn: "root",
        factory: function dC() {
          return `${mf()}${mf()}${mf()}`;
        },
      });
      function mf() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const fC = new V("Platform Initializer"),
        _f = new V("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        hC = new V("appBootstrapListener"),
        pC = new V("AnimationModuleType");
      let CR = (() => {
        class n {
          log(t) {
            console.log(t);
          }
          warn(t) {
            console.warn(t);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      const sr = new V("LocaleId", {
        providedIn: "root",
        factory: () =>
          oe(sr, q.Optional | q.SkipSelf) ||
          (function DR() {
            return (typeof $localize < "u" && $localize.locale) || Zi;
          })(),
      });
      class ER {
        constructor(e, t) {
          (this.ngModuleFactory = e), (this.componentFactories = t);
        }
      }
      let gC = (() => {
        class n {
          compileModuleSync(t) {
            return new ef(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const r = this.compileModuleSync(t),
              o = rr(kt(t).declarations).reduce((s, a) => {
                const l = ye(a);
                return l && s.push(new is(l)), s;
              }, []);
            return new ER(r, o);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const MR = (() => Promise.resolve(0))();
      function yf(n) {
        typeof Zone > "u"
          ? MR.then(() => {
              n && n.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", n);
      }
      class Ve {
        constructor({
          enableLongStackTrace: e = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new he(!1)),
            (this.onMicrotaskEmpty = new he(!1)),
            (this.onStable = new he(!1)),
            (this.onError = new he(!1)),
            typeof Zone > "u")
          )
            throw new T(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            e &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && t),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function TR() {
              let n = Me.requestAnimationFrame,
                e = Me.cancelAnimationFrame;
              if (typeof Zone < "u" && n && e) {
                const t = n[Zone.__symbol__("OriginalDelegate")];
                t && (n = t);
                const r = e[Zone.__symbol__("OriginalDelegate")];
                r && (e = r);
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: e,
              };
            })().nativeRequestAnimationFrame),
            (function xR(n) {
              const e = () => {
                !(function AR(n) {
                  n.isCheckStableRunning ||
                    -1 !== n.lastRequestAnimationFrameId ||
                    ((n.lastRequestAnimationFrameId =
                      n.nativeRequestAnimationFrame.call(Me, () => {
                        n.fakeTopEventTask ||
                          (n.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (n.lastRequestAnimationFrameId = -1),
                                Cf(n),
                                (n.isCheckStableRunning = !0),
                                vf(n),
                                (n.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          n.fakeTopEventTask.invoke();
                      })),
                    Cf(n));
                })(n);
              };
              n._inner = n._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, r, i, o, s, a) => {
                  try {
                    return yC(n), t.invokeTask(i, o, s, a);
                  } finally {
                    ((n.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      n.shouldCoalesceRunChangeDetection) &&
                      e(),
                      vC(n);
                  }
                },
                onInvoke: (t, r, i, o, s, a, l) => {
                  try {
                    return yC(n), t.invoke(i, o, s, a, l);
                  } finally {
                    n.shouldCoalesceRunChangeDetection && e(), vC(n);
                  }
                },
                onHasTask: (t, r, i, o) => {
                  t.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((n._hasPendingMicrotasks = o.microTask),
                          Cf(n),
                          vf(n))
                        : "macroTask" == o.change &&
                          (n.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (t, r, i, o) => (
                  t.handleError(i, o),
                  n.runOutsideAngular(() => n.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Ve.isInAngularZone()) throw new T(909, !1);
        }
        static assertNotInAngularZone() {
          if (Ve.isInAngularZone()) throw new T(909, !1);
        }
        run(e, t, r) {
          return this._inner.run(e, t, r);
        }
        runTask(e, t, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, e, IR, Ml, Ml);
          try {
            return o.runTask(s, t, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(e, t, r) {
          return this._inner.runGuarded(e, t, r);
        }
        runOutsideAngular(e) {
          return this._outer.run(e);
        }
      }
      const IR = {};
      function vf(n) {
        if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable)
          try {
            n._nesting++, n.onMicrotaskEmpty.emit(null);
          } finally {
            if ((n._nesting--, !n.hasPendingMicrotasks))
              try {
                n.runOutsideAngular(() => n.onStable.emit(null));
              } finally {
                n.isStable = !0;
              }
          }
      }
      function Cf(n) {
        n.hasPendingMicrotasks = !!(
          n._hasPendingMicrotasks ||
          ((n.shouldCoalesceEventChangeDetection ||
            n.shouldCoalesceRunChangeDetection) &&
            -1 !== n.lastRequestAnimationFrameId)
        );
      }
      function yC(n) {
        n._nesting++,
          n.isStable && ((n.isStable = !1), n.onUnstable.emit(null));
      }
      function vC(n) {
        n._nesting--, vf(n);
      }
      class RR {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new he()),
            (this.onMicrotaskEmpty = new he()),
            (this.onStable = new he()),
            (this.onError = new he());
        }
        run(e, t, r) {
          return e.apply(t, r);
        }
        runGuarded(e, t, r) {
          return e.apply(t, r);
        }
        runOutsideAngular(e) {
          return e();
        }
        runTask(e, t, r, i) {
          return e.apply(t, r);
        }
      }
      const CC = new V(""),
        Al = new V("");
      let Ef,
        Df = (() => {
          class n {
            constructor(t, r, i) {
              (this._ngZone = t),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Ef ||
                  ((function NR(n) {
                    Ef = n;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Ve.assertNotInAngularZone(),
                        yf(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                yf(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(t) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    t(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: i });
            }
            whenStable(t, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(t) {
              this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
              this.registry.unregisterApplication(t);
            }
            findProviders(t, r, i) {
              return [];
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(Ve), N(bf), N(Al));
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        bf = (() => {
          class n {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, r) {
              this._applications.set(t, r);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, r = !0) {
              return Ef?.findTestabilityInTree(this, t, r) ?? null;
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({
              token: n,
              factory: n.ɵfac,
              providedIn: "platform",
            })),
            n
          );
        })(),
        Sr = null;
      const DC = new V("AllowMultipleToken"),
        wf = new V("PlatformDestroyListeners");
      class bC {
        constructor(e, t) {
          (this.name = e), (this.token = t);
        }
      }
      function wC(n, e, t = []) {
        const r = `Platform: ${e}`,
          i = new V(r);
        return (o = []) => {
          let s = Sf();
          if (!s || s.injector.get(DC, !1)) {
            const a = [...t, ...o, { provide: i, useValue: !0 }];
            n
              ? n(a)
              : (function kR(n) {
                  if (Sr && !Sr.get(DC, !1)) throw new T(400, !1);
                  Sr = n;
                  const e = n.get(MC);
                  (function EC(n) {
                    const e = n.get(fC, null);
                    e && e.forEach((t) => t());
                  })(n);
                })(
                  (function SC(n = [], e) {
                    return Jt.create({
                      name: e,
                      providers: [
                        { provide: hd, useValue: "platform" },
                        { provide: wf, useValue: new Set([() => (Sr = null)]) },
                        ...n,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function LR(n) {
            const e = Sf();
            if (!e) throw new T(401, !1);
            return e;
          })();
        };
      }
      function Sf() {
        return Sr?.get(MC) ?? null;
      }
      let MC = (() => {
        class n {
          constructor(t) {
            (this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, r) {
            const i = (function IC(n, e) {
                let t;
                return (
                  (t =
                    "noop" === n
                      ? new RR()
                      : ("zone.js" === n ? void 0 : n) || new Ve(e)),
                  t
                );
              })(
                r?.ngZone,
                (function TC(n) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!n || !n.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!n || !n.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              o = [{ provide: Ve, useValue: i }];
            return i.run(() => {
              const s = Jt.create({
                  providers: o,
                  parent: this.injector,
                  name: t.moduleType.name,
                }),
                a = t.create(s),
                l = a.injector.get(Li, null);
              if (!l) throw new T(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const u = i.onError.subscribe({
                    next: (c) => {
                      l.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    xl(this._modules, a), u.unsubscribe();
                  });
                }),
                (function AC(n, e, t) {
                  try {
                    const r = t();
                    return ss(r)
                      ? r.catch((i) => {
                          throw (
                            (e.runOutsideAngular(() => n.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (e.runOutsideAngular(() => n.handleError(r)), r);
                  }
                })(l, i, () => {
                  const u = a.injector.get(Il);
                  return (
                    u.runInitializers(),
                    u.donePromise.then(
                      () => (
                        (function Xy(n) {
                          Wt(n, "Expected localeId to be defined"),
                            "string" == typeof n &&
                              (Yy = n.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(sr, Zi) || Zi),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, r = []) {
            const i = xC({}, r);
            return (function FR(n, e, t) {
              const r = new ef(t);
              return Promise.resolve(r);
            })(0, 0, t).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(_s);
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!t.instance.ngDoBootstrap) throw new T(-403, !1);
              t.instance.ngDoBootstrap(r);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new T(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const t = this._injector.get(wf, null);
            t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Jt));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      function xC(n, e) {
        return Array.isArray(e) ? e.reduce(xC, n) : { ...n, ...e };
      }
      let _s = (() => {
        class n {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(t, r, i) {
            (this._zone = t),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const o = new Ue((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new Ue((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    Ve.assertNotInAngularZone(),
                      yf(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const u = this._zone.onUnstable.subscribe(() => {
                  Ve.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), u.unsubscribe();
                };
              });
            this.isStable = (function Vw(...n) {
              const e = Io(n),
                t = (function Rw(n, e) {
                  return "number" == typeof nc(n) ? n.pop() : e;
                })(n, 1 / 0),
                r = n;
              return r.length
                ? 1 === r.length
                  ? dn(r[0])
                  : _i(t)(Be(r, e))
                : In;
            })(
              o,
              s.pipe(
                (function $w(n = {}) {
                  const {
                    connector: e = () => new Nt(),
                    resetOnError: t = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: i = !0,
                  } = n;
                  return (o) => {
                    let s,
                      a,
                      l,
                      u = 0,
                      c = !1,
                      d = !1;
                    const p = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      g = () => {
                        p(), (s = l = void 0), (c = d = !1);
                      },
                      m = () => {
                        const C = s;
                        g(), C?.unsubscribe();
                      };
                    return tt((C, E) => {
                      u++, !d && !c && p();
                      const w = (l = l ?? e());
                      E.add(() => {
                        u--, 0 === u && !d && !c && (a = rc(m, i));
                      }),
                        w.subscribe(E),
                        !s &&
                          u > 0 &&
                          ((s = new To({
                            next: (R) => w.next(R),
                            error: (R) => {
                              (d = !0), p(), (a = rc(g, t, R)), w.error(R);
                            },
                            complete: () => {
                              (c = !0), p(), (a = rc(g, r)), w.complete();
                            },
                          })),
                          dn(C).subscribe(s));
                    })(o);
                  };
                })()
              )
            );
          }
          bootstrap(t, r) {
            const i = t instanceof o_;
            if (!this._injector.get(Il).done)
              throw (
                (!i &&
                  (function vi(n) {
                    const e = ye(n) || ct(n) || Ct(n);
                    return null !== e && e.standalone;
                  })(t),
                new T(405, false))
              );
            let s;
            (s = i ? t : this._injector.get(Jo).resolveComponentFactory(t)),
              this.componentTypes.push(s.componentType);
            const a = (function PR(n) {
                return n.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Ji),
              u = s.create(Jt.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(CC, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  xl(this.components, u),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new T(101, !1);
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(t)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const r = t;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(t) {
            const r = t;
            xl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView), this.tick(), this.components.push(t);
            const r = this._injector.get(hC, []);
            r.push(...this._bootstrapListeners), r.forEach((i) => i(t));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((t) => t()),
                  this._views.slice().forEach((t) => t.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(t) {
            return (
              this._destroyListeners.push(t),
              () => xl(this._destroyListeners, t)
            );
          }
          destroy() {
            if (this._destroyed) throw new T(406, !1);
            const t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Ve), N(Nn), N(Li));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function xl(n, e) {
        const t = n.indexOf(e);
        t > -1 && n.splice(t, 1);
      }
      let Rl = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = $R), n;
      })();
      function $R(n) {
        return (function UR(n, e, t) {
          if (Oo(n) && !t) {
            const r = Vt(n.index, e);
            return new rs(r, r);
          }
          return 47 & n.type ? new rs(e[16], e) : null;
        })(ot(), A(), 16 == (16 & n));
      }
      class kC {
        constructor() {}
        supports(e) {
          return gl(e);
        }
        create(e) {
          return new qR(e);
        }
      }
      const zR = (n, e) => e;
      class qR {
        constructor(e) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = e || zR);
        }
        forEachItem(e) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) e(t);
        }
        forEachOperation(e) {
          let t = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; t || r; ) {
            const s = !r || (t && t.currentIndex < LC(r, i, o)) ? t : r,
              a = LC(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const u = a - i,
                c = l - i;
              if (u != c) {
                for (let p = 0; p < u; p++) {
                  const g = p < o.length ? o[p] : (o[p] = 0),
                    m = g + p;
                  c <= m && m < u && (o[p] = g + 1);
                }
                o[s.previousIndex] = c - u;
              }
            }
            a !== l && e(s, a, l);
          }
        }
        forEachPreviousItem(e) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) e(t);
        }
        forEachAddedItem(e) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) e(t);
        }
        forEachMovedItem(e) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) e(t);
        }
        forEachRemovedItem(e) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) e(t);
        }
        forEachIdentityChange(e) {
          let t;
          for (
            t = this._identityChangesHead;
            null !== t;
            t = t._nextIdentityChange
          )
            e(t);
        }
        diff(e) {
          if ((null == e && (e = []), !gl(e))) throw new T(900, !1);
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let i,
            o,
            s,
            t = this._itHead,
            r = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++)
              (o = e[a]),
                (s = this._trackByFn(a, o)),
                null !== t && Object.is(t.trackById, s)
                  ? (r && (t = this._verifyReinsertion(t, o, s, a)),
                    Object.is(t.item, o) || this._addIdentityChange(t, o))
                  : ((t = this._mismatch(t, o, s, a)), (r = !0)),
                (t = t._next);
          } else
            (i = 0),
              (function _I(n, e) {
                if (Array.isArray(n))
                  for (let t = 0; t < n.length; t++) e(n[t]);
                else {
                  const t = n[Zr()]();
                  let r;
                  for (; !(r = t.next()).done; ) e(r.value);
                }
              })(e, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (r && (t = this._verifyReinsertion(t, a, s, i)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, i)), (r = !0)),
                  (t = t._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(t), (this.collection = e), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (
              e = this._previousItHead = this._itHead;
              null !== e;
              e = e._next
            )
              e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded)
              e.previousIndex = e.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                e = this._movesHead;
              null !== e;
              e = e._nextMoved
            )
              e.previousIndex = e.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(e, t, r, i) {
          let o;
          return (
            null === e ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
            null !==
            (e =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(e.item, t) || this._addIdentityChange(e, t),
                this._reinsertAfter(e, o, i))
              : null !==
                (e =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(e.item, t) || this._addIdentityChange(e, t),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new WR(t, r), o, i)),
            e
          );
        }
        _verifyReinsertion(e, t, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (e = this._reinsertAfter(o, e._prev, i))
              : e.currentIndex != i &&
                ((e.currentIndex = i), this._addToMoves(e, i)),
            e
          );
        }
        _truncate(e) {
          for (; null !== e; ) {
            const t = e._next;
            this._addToRemovals(this._unlink(e)), (e = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(e, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const i = e._prevRemoved,
            o = e._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(e, t, r),
            this._addToMoves(e, r),
            e
          );
        }
        _moveAfter(e, t, r) {
          return (
            this._unlink(e),
            this._insertAfter(e, t, r),
            this._addToMoves(e, r),
            e
          );
        }
        _addAfter(e, t, r) {
          return (
            this._insertAfter(e, t, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = e)
                : (this._additionsTail._nextAdded = e)),
            e
          );
        }
        _insertAfter(e, t, r) {
          const i = null === t ? this._itHead : t._next;
          return (
            (e._next = i),
            (e._prev = t),
            null === i ? (this._itTail = e) : (i._prev = e),
            null === t ? (this._itHead = e) : (t._next = e),
            null === this._linkedRecords && (this._linkedRecords = new OC()),
            this._linkedRecords.put(e),
            (e.currentIndex = r),
            e
          );
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e));
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const t = e._prev,
            r = e._next;
          return (
            null === t ? (this._itHead = r) : (t._next = r),
            null === r ? (this._itTail = t) : (r._prev = t),
            e
          );
        }
        _addToMoves(e, t) {
          return (
            e.previousIndex === t ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = e)
                  : (this._movesTail._nextMoved = e)),
            e
          );
        }
        _addToRemovals(e) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new OC()),
            this._unlinkedRecords.put(e),
            (e.currentIndex = null),
            (e._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = e),
                (e._prevRemoved = null))
              : ((e._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = e)),
            e
          );
        }
        _addIdentityChange(e, t) {
          return (
            (e.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = e)
                : (this._identityChangesTail._nextIdentityChange = e)),
            e
          );
        }
      }
      class WR {
        constructor(e, t) {
          (this.item = e),
            (this.trackById = t),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class KR {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(e) {
          null === this._head
            ? ((this._head = this._tail = e),
              (e._nextDup = null),
              (e._prevDup = null))
            : ((this._tail._nextDup = e),
              (e._prevDup = this._tail),
              (e._nextDup = null),
              (this._tail = e));
        }
        get(e, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === t || t <= r.currentIndex) &&
              Object.is(r.trackById, e)
            )
              return r;
          return null;
        }
        remove(e) {
          const t = e._prevDup,
            r = e._nextDup;
          return (
            null === t ? (this._head = r) : (t._nextDup = r),
            null === r ? (this._tail = t) : (r._prevDup = t),
            null === this._head
          );
        }
      }
      class OC {
        constructor() {
          this.map = new Map();
        }
        put(e) {
          const t = e.trackById;
          let r = this.map.get(t);
          r || ((r = new KR()), this.map.set(t, r)), r.add(e);
        }
        get(e, t) {
          const i = this.map.get(e);
          return i ? i.get(e, t) : null;
        }
        remove(e) {
          const t = e.trackById;
          return this.map.get(t).remove(e) && this.map.delete(t), e;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function LC(n, e, t) {
        const r = n.previousIndex;
        if (null === r) return r;
        let i = 0;
        return t && r < t.length && (i = t[r]), r + e + i;
      }
      function $C() {
        return new Pl([new kC()]);
      }
      let Pl = (() => {
        class n {
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (null != r) {
              const i = r.factories.slice();
              t = t.concat(i);
            }
            return new n(t);
          }
          static extend(t) {
            return {
              provide: n,
              useFactory: (r) => n.create(t, r || $C()),
              deps: [[n, new Go(), new Ho()]],
            };
          }
          find(t) {
            const r = this.factories.find((i) => i.supports(t));
            if (null != r) return r;
            throw new T(901, !1);
          }
        }
        return (n.ɵprov = O({ token: n, providedIn: "root", factory: $C })), n;
      })();
      const JR = wC(null, "core", []);
      let eN = (() => {
        class n {
          constructor(t) {}
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(_s));
          }),
          (n.ɵmod = Qt({ type: n })),
          (n.ɵinj = Pt({})),
          n
        );
      })();
      function no(n) {
        return "boolean" == typeof n ? n : null != n && "false" !== n;
      }
      let xf = null;
      function Vn() {
        return xf;
      }
      class rN {}
      const at = new V("DocumentToken");
      let Rf = (() => {
        class n {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({
            token: n,
            factory: function () {
              return (function iN() {
                return N(BC);
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      const oN = new V("Location Initialized");
      let BC = (() => {
        class n extends Rf {
          constructor(t) {
            super(),
              (this._doc = t),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Vn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const r = Vn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", t, !1),
              () => r.removeEventListener("popstate", t)
            );
          }
          onHashChange(t) {
            const r = Vn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", t, !1),
              () => r.removeEventListener("hashchange", t)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(t) {
            this._location.pathname = t;
          }
          pushState(t, r, i) {
            jC() ? this._history.pushState(t, r, i) : (this._location.hash = i);
          }
          replaceState(t, r, i) {
            jC()
              ? this._history.replaceState(t, r, i)
              : (this._location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(at));
          }),
          (n.ɵprov = O({
            token: n,
            factory: function () {
              return (function sN() {
                return new BC(N(at));
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      function jC() {
        return !!window.history.pushState;
      }
      function Nf(n, e) {
        if (0 == n.length) return e;
        if (0 == e.length) return n;
        let t = 0;
        return (
          n.endsWith("/") && t++,
          e.startsWith("/") && t++,
          2 == t ? n + e.substring(1) : 1 == t ? n + e : n + "/" + e
        );
      }
      function HC(n) {
        const e = n.match(/#|\?|$/),
          t = (e && e.index) || n.length;
        return n.slice(0, t - ("/" === n[t - 1] ? 1 : 0)) + n.slice(t);
      }
      function lr(n) {
        return n && "?" !== n[0] ? "?" + n : n;
      }
      let ri = (() => {
        class n {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({
            token: n,
            factory: function () {
              return oe(zC);
            },
            providedIn: "root",
          })),
          n
        );
      })();
      const GC = new V("appBaseHref");
      let zC = (() => {
          class n extends ri {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  oe(at).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return Nf(this._baseHref, t);
            }
            path(t = !1) {
              const r =
                  this._platformLocation.pathname +
                  lr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && t ? `${r}${i}` : r;
            }
            pushState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + lr(o));
              this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + lr(o));
              this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(Rf), N(GC, 8));
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        aN = (() => {
          class n extends ri {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(t) {
              const r = Nf(this._baseHref, t);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + lr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + lr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(Rf), N(GC, 8));
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        Ff = (() => {
          class n {
            constructor(t) {
              (this._subject = new he()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function cN(n) {
                if (new RegExp("^(https?:)?//").test(n)) {
                  const [, t] = n.split(/\/\/[^\/]+/);
                  return t;
                }
                return n;
              })(HC(qC(r)))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(t = !1) {
              return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, r = "") {
              return this.path() == this.normalize(t + lr(r));
            }
            normalize(t) {
              return n.stripTrailingSlash(
                (function uN(n, e) {
                  return n && new RegExp(`^${n}([/;?#]|$)`).test(e)
                    ? e.substring(n.length)
                    : e;
                })(this._basePath, qC(t))
              );
            }
            prepareExternalUrl(t) {
              return (
                t && "/" !== t[0] && (t = "/" + t),
                this._locationStrategy.prepareExternalUrl(t)
              );
            }
            go(t, r = "", i = null) {
              this._locationStrategy.pushState(i, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + lr(r)),
                  i
                );
            }
            replaceState(t, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + lr(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(t = 0) {
              this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
              return (
                this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = "", r) {
              this._urlChangeListeners.forEach((i) => i(t, r));
            }
            subscribe(t, r, i) {
              return this._subject.subscribe({
                next: t,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (n.normalizeQueryParams = lr),
            (n.joinWithSlash = Nf),
            (n.stripTrailingSlash = HC),
            (n.ɵfac = function (t) {
              return new (t || n)(N(ri));
            }),
            (n.ɵprov = O({
              token: n,
              factory: function () {
                return (function lN() {
                  return new Ff(N(ri));
                })();
              },
              providedIn: "root",
            })),
            n
          );
        })();
      function qC(n) {
        return n.replace(/\/index.html$/, "");
      }
      function tD(n, e) {
        e = encodeURIComponent(e);
        for (const t of n.split(";")) {
          const r = t.indexOf("="),
            [i, o] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
          if (i.trim() === e) return decodeURIComponent(o);
        }
        return null;
      }
      class QN {
        constructor(e, t, r, i) {
          (this.$implicit = e),
            (this.ngForOf = t),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let $n = (() => {
        class n {
          set ngForOf(t) {
            (this._ngForOf = t), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(t) {
            this._trackByFn = t;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(t, r, i) {
            (this._viewContainer = t),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(t) {
            t && (this._template = t);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const t = this._ngForOf;
              !this._differ &&
                t &&
                (this._differ = this._differs
                  .find(t)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf);
              t && this._applyChanges(t);
            }
          }
          _applyChanges(t) {
            const r = this._viewContainer;
            t.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new QN(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), oD(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((i) => {
              oD(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(M(Cn), M(or), M(Pl));
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          n
        );
      })();
      function oD(n, e) {
        n.context.$implicit = e.item;
      }
      let $e = (() => {
        class n {
          constructor(t, r) {
            (this._viewContainer = t),
              (this._context = new XN()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t),
              this._updateView();
          }
          set ngIfThen(t) {
            sD("ngIfThen", t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(t) {
            sD("ngIfElse", t),
              (this._elseTemplateRef = t),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(M(Cn), M(or));
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          n
        );
      })();
      class XN {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function sD(n, e) {
        if (e && !e.createEmbeddedView)
          throw new Error(
            `${n} must be a TemplateRef, but received '${we(e)}'.`
          );
      }
      let bF = (() => {
        class n {}
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵmod = Qt({ type: n })),
          (n.ɵinj = Pt({})),
          n
        );
      })();
      let MF = (() => {
        class n {}
        return (
          (n.ɵprov = O({
            token: n,
            providedIn: "root",
            factory: () => new TF(N(at), window),
          })),
          n
        );
      })();
      class TF {
        constructor(e, t) {
          (this.document = e), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(e) {
          this.offset = Array.isArray(e) ? () => e : e;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(e) {
          this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
        }
        scrollToAnchor(e) {
          if (!this.supportsScrolling()) return;
          const t = (function IF(n, e) {
            const t = n.getElementById(e) || n.getElementsByName(e)[0];
            if (t) return t;
            if (
              "function" == typeof n.createTreeWalker &&
              n.body &&
              (n.body.createShadowRoot || n.body.attachShadow)
            ) {
              const r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(e) || o.querySelector(`[name="${e}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, e);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(e) {
          if (this.supportScrollRestoration()) {
            const t = this.window.history;
            t && t.scrollRestoration && (t.scrollRestoration = e);
          }
        }
        scrollToElement(e) {
          const t = e.getBoundingClientRect(),
            r = t.left + this.window.pageXOffset,
            i = t.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const e =
              cD(this.window.history) ||
              cD(Object.getPrototypeOf(this.window.history));
            return !(!e || (!e.writable && !e.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function cD(n) {
        return Object.getOwnPropertyDescriptor(n, "scrollRestoration");
      }
      class dD {}
      class tP extends rN {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Yf extends tP {
        static makeCurrent() {
          !(function nN(n) {
            xf || (xf = n);
          })(new Yf());
        }
        onAndCancel(e, t, r) {
          return (
            e.addEventListener(t, r, !1),
            () => {
              e.removeEventListener(t, r, !1);
            }
          );
        }
        dispatchEvent(e, t) {
          e.dispatchEvent(t);
        }
        remove(e) {
          e.parentNode && e.parentNode.removeChild(e);
        }
        createElement(e, t) {
          return (t = t || this.getDefaultDocument()).createElement(e);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment;
        }
        getGlobalEventTarget(e, t) {
          return "window" === t
            ? window
            : "document" === t
            ? e
            : "body" === t
            ? e.body
            : null;
        }
        getBaseHref(e) {
          const t = (function nP() {
            return (
              (bs = bs || document.querySelector("base")),
              bs ? bs.getAttribute("href") : null
            );
          })();
          return null == t
            ? null
            : (function rP(n) {
                (zl = zl || document.createElement("a")),
                  zl.setAttribute("href", n);
                const e = zl.pathname;
                return "/" === e.charAt(0) ? e : `/${e}`;
              })(t);
        }
        resetBaseElement() {
          bs = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(e) {
          return tD(document.cookie, e);
        }
      }
      let zl,
        bs = null;
      const _D = new V("TRANSITION_ID"),
        oP = [
          {
            provide: Tl,
            useFactory: function iP(n, e, t) {
              return () => {
                t.get(Il).donePromise.then(() => {
                  const r = Vn(),
                    i = e.querySelectorAll(`style[ng-transition="${n}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [_D, at, Jt],
            multi: !0,
          },
        ];
      let aP = (() => {
        class n {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const ql = new V("EventManagerPlugins");
      let Wl = (() => {
        class n {
          constructor(t, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              t.forEach((i) => (i.manager = this)),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, r, i) {
            return this._findPluginFor(r).addEventListener(t, r, i);
          }
          addGlobalEventListener(t, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(t, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            const r = this._eventNameToPlugin.get(t);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(t)) return this._eventNameToPlugin.set(t, s), s;
            }
            throw new Error(`No event manager plugin found for event ${t}`);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(ql), N(Ve));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class yD {
        constructor(e) {
          this._doc = e;
        }
        addGlobalEventListener(e, t, r) {
          const i = Vn().getGlobalEventTarget(this._doc, e);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${t}`);
          return this.addEventListener(i, t, r);
        }
      }
      let vD = (() => {
          class n {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(t) {
              const r = new Set();
              t.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(t) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        Es = (() => {
          class n extends vD {
            constructor(t) {
              super(),
                (this._doc = t),
                (this._hostNodes = new Map()),
                this._hostNodes.set(t.head, []);
            }
            _addStylesToHost(t, r, i) {
              t.forEach((o) => {
                const s = this._doc.createElement("style");
                (s.textContent = o), i.push(r.appendChild(s));
              });
            }
            addHost(t) {
              const r = [];
              this._addStylesToHost(this._stylesSet, t, r),
                this._hostNodes.set(t, r);
            }
            removeHost(t) {
              const r = this._hostNodes.get(t);
              r && r.forEach(CD), this._hostNodes.delete(t);
            }
            onStylesAdded(t) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(t, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((t) => t.forEach(CD));
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(at));
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })();
      function CD(n) {
        Vn().remove(n);
      }
      const Xf = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Zf = /%COMP%/g;
      function Jf(n, e) {
        return e.flat(100).map((t) => t.replace(Zf, n));
      }
      function ED(n) {
        return (e) => {
          if ("__ngUnwrap__" === e) return n;
          !1 === n(e) && (e.preventDefault(), (e.returnValue = !1));
        };
      }
      let Kl = (() => {
        class n {
          constructor(t, r, i) {
            (this.eventManager = t),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new eh(t));
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case hn.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new hP(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(t),
                  i
                );
              }
              case hn.ShadowDom:
                return new pP(this.eventManager, this.sharedStylesHost, t, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = Jf(r.id, r.styles);
                  this.sharedStylesHost.addStyles(i),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Wl), N(Es), N(ms));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class eh {
        constructor(e) {
          (this.eventManager = e),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(e, t) {
          return t
            ? document.createElementNS(Xf[t] || t, e)
            : document.createElement(e);
        }
        createComment(e) {
          return document.createComment(e);
        }
        createText(e) {
          return document.createTextNode(e);
        }
        appendChild(e, t) {
          (SD(e) ? e.content : e).appendChild(t);
        }
        insertBefore(e, t, r) {
          e && (SD(e) ? e.content : e).insertBefore(t, r);
        }
        removeChild(e, t) {
          e && e.removeChild(t);
        }
        selectRootElement(e, t) {
          let r = "string" == typeof e ? document.querySelector(e) : e;
          if (!r)
            throw new Error(`The selector "${e}" did not match any elements`);
          return t || (r.textContent = ""), r;
        }
        parentNode(e) {
          return e.parentNode;
        }
        nextSibling(e) {
          return e.nextSibling;
        }
        setAttribute(e, t, r, i) {
          if (i) {
            t = i + ":" + t;
            const o = Xf[i];
            o ? e.setAttributeNS(o, t, r) : e.setAttribute(t, r);
          } else e.setAttribute(t, r);
        }
        removeAttribute(e, t, r) {
          if (r) {
            const i = Xf[r];
            i ? e.removeAttributeNS(i, t) : e.removeAttribute(`${r}:${t}`);
          } else e.removeAttribute(t);
        }
        addClass(e, t) {
          e.classList.add(t);
        }
        removeClass(e, t) {
          e.classList.remove(t);
        }
        setStyle(e, t, r, i) {
          i & (It.DashCase | It.Important)
            ? e.style.setProperty(t, r, i & It.Important ? "important" : "")
            : (e.style[t] = r);
        }
        removeStyle(e, t, r) {
          r & It.DashCase ? e.style.removeProperty(t) : (e.style[t] = "");
        }
        setProperty(e, t, r) {
          e[t] = r;
        }
        setValue(e, t) {
          e.nodeValue = t;
        }
        listen(e, t, r) {
          return "string" == typeof e
            ? this.eventManager.addGlobalEventListener(e, t, ED(r))
            : this.eventManager.addEventListener(e, t, ED(r));
        }
      }
      function SD(n) {
        return "TEMPLATE" === n.tagName && void 0 !== n.content;
      }
      class hP extends eh {
        constructor(e, t, r, i) {
          super(e), (this.component = r);
          const o = Jf(i + "-" + r.id, r.styles);
          t.addStyles(o),
            (this.contentAttr = (function cP(n) {
              return "_ngcontent-%COMP%".replace(Zf, n);
            })(i + "-" + r.id)),
            (this.hostAttr = (function dP(n) {
              return "_nghost-%COMP%".replace(Zf, n);
            })(i + "-" + r.id));
        }
        applyToHost(e) {
          super.setAttribute(e, this.hostAttr, "");
        }
        createElement(e, t) {
          const r = super.createElement(e, t);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class pP extends eh {
        constructor(e, t, r, i) {
          super(e),
            (this.sharedStylesHost = t),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = Jf(i.id, i.styles);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement("style");
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(e, t) {
          return super.appendChild(this.nodeOrShadowRoot(e), t);
        }
        insertBefore(e, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(e), t, r);
        }
        removeChild(e, t) {
          return super.removeChild(this.nodeOrShadowRoot(e), t);
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(e))
          );
        }
      }
      let gP = (() => {
        class n extends yD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, r, i) {
            return (
              t.addEventListener(r, i, !1),
              () => this.removeEventListener(t, r, i)
            );
          }
          removeEventListener(t, r, i) {
            return t.removeEventListener(r, i);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(at));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const MD = ["alt", "control", "meta", "shift"],
        mP = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        _P = {
          alt: (n) => n.altKey,
          control: (n) => n.ctrlKey,
          meta: (n) => n.metaKey,
          shift: (n) => n.shiftKey,
        };
      let yP = (() => {
        class n extends yD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != n.parseEventName(t);
          }
          addEventListener(t, r, i) {
            const o = n.parseEventName(r),
              s = n.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Vn().onAndCancel(t, o.domEventName, s));
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = n._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              MD.forEach((u) => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(t, r) {
            let i = mP[t.key] || t.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = t.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                MD.forEach((s) => {
                  s !== i && (0, _P[s])(t) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(t, r, i) {
            return (o) => {
              n.matchEventFullKeyCode(o, t) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(at));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const bP = wC(JR, "browser", [
          { provide: _f, useValue: "browser" },
          {
            provide: fC,
            useValue: function vP() {
              Yf.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: at,
            useFactory: function DP() {
              return (
                (function Z0(n) {
                  id = n;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        AD = new V(""),
        xD = [
          {
            provide: Al,
            useClass: class sP {
              addToWindow(e) {
                (Me.getAngularTestability = (r, i = !0) => {
                  const o = e.findTestabilityInTree(r, i);
                  if (null == o)
                    throw new Error("Could not find testability for element.");
                  return o;
                }),
                  (Me.getAllAngularTestabilities = () =>
                    e.getAllTestabilities()),
                  (Me.getAllAngularRootElements = () => e.getAllRootElements()),
                  Me.frameworkStabilizers || (Me.frameworkStabilizers = []),
                  Me.frameworkStabilizers.push((r) => {
                    const i = Me.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(e, t, r) {
                return null == t
                  ? null
                  : e.getTestability(t) ??
                      (r
                        ? Vn().isShadowRoot(t)
                          ? this.findTestabilityInTree(e, t.host, !0)
                          : this.findTestabilityInTree(e, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: CC, useClass: Df, deps: [Ve, bf, Al] },
          { provide: Df, useClass: Df, deps: [Ve, bf, Al] },
        ],
        RD = [
          { provide: hd, useValue: "root" },
          {
            provide: Li,
            useFactory: function CP() {
              return new Li();
            },
            deps: [],
          },
          { provide: ql, useClass: gP, multi: !0, deps: [at, Ve, _f] },
          { provide: ql, useClass: yP, multi: !0, deps: [at] },
          { provide: Kl, useClass: Kl, deps: [Wl, Es, ms] },
          { provide: es, useExisting: Kl },
          { provide: vD, useExisting: Es },
          { provide: Es, useClass: Es, deps: [at] },
          { provide: Wl, useClass: Wl, deps: [ql, Ve] },
          { provide: dD, useClass: aP, deps: [] },
          [],
        ];
      let ND = (() => {
          class n {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: n,
                providers: [
                  { provide: ms, useValue: t.appId },
                  { provide: _D, useExisting: ms },
                  oP,
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(AD, 12));
            }),
            (n.ɵmod = Qt({ type: n })),
            (n.ɵinj = Pt({ providers: [...RD, ...xD], imports: [bF, eN] })),
            n
          );
        })(),
        FD = (() => {
          class n {
            constructor(t) {
              this._doc = t;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(t) {
              this._doc.title = t || "";
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(at));
            }),
            (n.ɵprov = O({
              token: n,
              factory: function (t) {
                let r = null;
                return (
                  (r = t
                    ? new t()
                    : (function wP() {
                        return new FD(N(at));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            n
          );
        })();
      function H(...n) {
        return Be(n, Io(n));
      }
      typeof window < "u" && window;
      class wn extends Nt {
        constructor(e) {
          super(), (this._value = e);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(e) {
          const t = super._subscribe(e);
          return !t.closed && e.next(this._value), t;
        }
        getValue() {
          const { hasError: e, thrownError: t, _value: r } = this;
          if (e) throw t;
          return this._throwIfClosed(), r;
        }
        next(e) {
          super.next((this._value = e));
        }
      }
      const Ql = So(
          (n) =>
            function () {
              n(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
            }
        ),
        { isArray: NP } = Array,
        { getPrototypeOf: FP, prototype: PP, keys: kP } = Object;
      function OD(n) {
        if (1 === n.length) {
          const e = n[0];
          if (NP(e)) return { args: e, keys: null };
          if (
            (function OP(n) {
              return n && "object" == typeof n && FP(n) === PP;
            })(e)
          ) {
            const t = kP(e);
            return { args: t.map((r) => e[r]), keys: t };
          }
        }
        return { args: n, keys: null };
      }
      const { isArray: LP } = Array;
      function LD(n) {
        return re((e) =>
          (function VP(n, e) {
            return LP(e) ? n(...e) : n(e);
          })(n, e)
        );
      }
      function VD(n, e) {
        return n.reduce((t, r, i) => ((t[r] = e[i]), t), {});
      }
      function $D(...n) {
        const e = Io(n),
          t = Zp(n),
          { args: r, keys: i } = OD(n);
        if (0 === r.length) return Be([], e);
        const o = new Ue(
          (function $P(n, e, t = jr) {
            return (r) => {
              UD(
                e,
                () => {
                  const { length: i } = n,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    UD(
                      e,
                      () => {
                        const u = Be(n[l], e);
                        let c = !1;
                        u.subscribe(
                          Ye(
                            r,
                            (d) => {
                              (o[l] = d),
                                c || ((c = !0), a--),
                                a || r.next(t(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, e, i ? (s) => VD(i, s) : jr)
        );
        return t ? o.pipe(LD(t)) : o;
      }
      function UD(n, e, t) {
        n ? Qn(t, n, e) : e();
      }
      function rh(...n) {
        return (function UP() {
          return _i(1);
        })()(Be(n, Io(n)));
      }
      function BD(n) {
        return new Ue((e) => {
          dn(n()).subscribe(e);
        });
      }
      function Ie(n, e) {
        const t = Ee(n) ? n : () => n,
          r = (i) => i.error(t());
        return new Ue(e ? (i) => e.schedule(r, 0, i) : r);
      }
      function ih() {
        return tt((n, e) => {
          let t = null;
          n._refCount++;
          const r = Ye(e, void 0, void 0, void 0, () => {
            if (!n || n._refCount <= 0 || 0 < --n._refCount)
              return void (t = null);
            const i = n._connection,
              o = t;
            (t = null),
              i && (!o || i === o) && i.unsubscribe(),
              e.unsubscribe();
          });
          n.subscribe(r), r.closed || (t = n.connect());
        });
      }
      class jD extends Ue {
        constructor(e, t) {
          super(),
            (this.source = e),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Vp(e) && (this.lift = e.lift);
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e);
        }
        getSubject() {
          const e = this._subject;
          return (
            (!e || e.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: e } = this;
          (this._subject = this._connection = null), e?.unsubscribe();
        }
        connect() {
          let e = this._connection;
          if (!e) {
            e = this._connection = new qt();
            const t = this.getSubject();
            e.add(
              this.source.subscribe(
                Ye(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (r) => {
                    this._teardown(), t.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              e.closed && ((this._connection = null), (e = qt.EMPTY));
          }
          return e;
        }
        refCount() {
          return ih()(this);
        }
      }
      function Sn(n, e) {
        return tt((t, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          t.subscribe(
            Ye(
              r,
              (l) => {
                i?.unsubscribe();
                let u = 0;
                const c = o++;
                dn(n(l, c)).subscribe(
                  (i = Ye(
                    r,
                    (d) => r.next(e ? e(l, d, c, u++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function ws(n) {
        return n <= 0
          ? () => In
          : tt((e, t) => {
              let r = 0;
              e.subscribe(
                Ye(t, (i) => {
                  ++r <= n && (t.next(i), n <= r && t.complete());
                })
              );
            });
      }
      function cr(n, e) {
        return tt((t, r) => {
          let i = 0;
          t.subscribe(Ye(r, (o) => n.call(e, o, i++) && r.next(o)));
        });
      }
      function Yl(n) {
        return tt((e, t) => {
          let r = !1;
          e.subscribe(
            Ye(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => {
                r || t.next(n), t.complete();
              }
            )
          );
        });
      }
      function HD(n = jP) {
        return tt((e, t) => {
          let r = !1;
          e.subscribe(
            Ye(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => (r ? t.complete() : t.error(n()))
            )
          );
        });
      }
      function jP() {
        return new Ql();
      }
      function Tr(n, e) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? cr((i, o) => n(i, o, r)) : jr,
            ws(1),
            t ? Yl(e) : HD(() => new Ql())
          );
      }
      function Ir(n, e) {
        return Ee(e) ? rt(n, e, 1) : rt(n, 1);
      }
      function gt(n, e, t) {
        const r = Ee(n) || e || t ? { next: n, error: e, complete: t } : n;
        return r
          ? tt((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                Ye(
                  o,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      o.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      o.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : jr;
      }
      function Ce(n) {
        return tt((e, t) => {
          let o,
            r = null,
            i = !1;
          (r = e.subscribe(
            Ye(t, void 0, void 0, (s) => {
              (o = dn(n(s, Ce(n)(e)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(t)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(t));
        });
      }
      function HP(n, e, t, r, i) {
        return (o, s) => {
          let a = t,
            l = e,
            u = 0;
          o.subscribe(
            Ye(
              s,
              (c) => {
                const d = u++;
                (l = a ? n(l, c, d) : ((a = !0), c)), r && s.next(l);
              },
              i &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function GD(n, e) {
        return tt(HP(n, e, arguments.length >= 2, !0));
      }
      function oh(n) {
        return n <= 0
          ? () => In
          : tt((e, t) => {
              let r = [];
              e.subscribe(
                Ye(
                  t,
                  (i) => {
                    r.push(i), n < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) t.next(i);
                    t.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function zD(n, e) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? cr((i, o) => n(i, o, r)) : jr,
            oh(1),
            t ? Yl(e) : HD(() => new Ql())
          );
      }
      function sh(n) {
        return tt((e, t) => {
          try {
            e.subscribe(t);
          } finally {
            t.add(n);
          }
        });
      }
      const ee = "primary",
        Ss = Symbol("RouteTitle");
      class qP {
        constructor(e) {
          this.params = e || {};
        }
        has(e) {
          return Object.prototype.hasOwnProperty.call(this.params, e);
        }
        get(e) {
          if (this.has(e)) {
            const t = this.params[e];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(e) {
          if (this.has(e)) {
            const t = this.params[e];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function ro(n) {
        return new qP(n);
      }
      function WP(n, e, t) {
        const r = t.path.split("/");
        if (
          r.length > n.length ||
          ("full" === t.pathMatch && (e.hasChildren() || r.length < n.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = n[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: n.slice(0, r.length), posParams: i };
      }
      function Un(n, e) {
        const t = n ? Object.keys(n) : void 0,
          r = e ? Object.keys(e) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let i;
        for (let o = 0; o < t.length; o++)
          if (((i = t[o]), !qD(n[i], e[i]))) return !1;
        return !0;
      }
      function qD(n, e) {
        if (Array.isArray(n) && Array.isArray(e)) {
          if (n.length !== e.length) return !1;
          const t = [...n].sort(),
            r = [...e].sort();
          return t.every((i, o) => r[o] === i);
        }
        return n === e;
      }
      function WD(n) {
        return Array.prototype.concat.apply([], n);
      }
      function KD(n) {
        return n.length > 0 ? n[n.length - 1] : null;
      }
      function lt(n, e) {
        for (const t in n) n.hasOwnProperty(t) && e(n[t], t);
      }
      function Ar(n) {
        return jd(n) ? n : ss(n) ? Be(Promise.resolve(n)) : H(n);
      }
      const Xl = !1,
        QP = {
          exact: function XD(n, e, t) {
            if (
              !oi(n.segments, e.segments) ||
              !Zl(n.segments, e.segments, t) ||
              n.numberOfChildren !== e.numberOfChildren
            )
              return !1;
            for (const r in e.children)
              if (!n.children[r] || !XD(n.children[r], e.children[r], t))
                return !1;
            return !0;
          },
          subset: ZD,
        },
        QD = {
          exact: function YP(n, e) {
            return Un(n, e);
          },
          subset: function XP(n, e) {
            return (
              Object.keys(e).length <= Object.keys(n).length &&
              Object.keys(e).every((t) => qD(n[t], e[t]))
            );
          },
          ignored: () => !0,
        };
      function YD(n, e, t) {
        return (
          QP[t.paths](n.root, e.root, t.matrixParams) &&
          QD[t.queryParams](n.queryParams, e.queryParams) &&
          !("exact" === t.fragment && n.fragment !== e.fragment)
        );
      }
      function ZD(n, e, t) {
        return JD(n, e, e.segments, t);
      }
      function JD(n, e, t, r) {
        if (n.segments.length > t.length) {
          const i = n.segments.slice(0, t.length);
          return !(!oi(i, t) || e.hasChildren() || !Zl(i, t, r));
        }
        if (n.segments.length === t.length) {
          if (!oi(n.segments, t) || !Zl(n.segments, t, r)) return !1;
          for (const i in e.children)
            if (!n.children[i] || !ZD(n.children[i], e.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = t.slice(0, n.segments.length),
            o = t.slice(n.segments.length);
          return (
            !!(oi(n.segments, i) && Zl(n.segments, i, r) && n.children[ee]) &&
            JD(n.children[ee], e, o, r)
          );
        }
      }
      function Zl(n, e, t) {
        return e.every((r, i) => QD[t](n[i].parameters, r.parameters));
      }
      class ii {
        constructor(e = new ae([], {}), t = {}, r = null) {
          (this.root = e), (this.queryParams = t), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = ro(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return ek.serialize(this);
        }
      }
      class ae {
        constructor(e, t) {
          (this.segments = e),
            (this.children = t),
            (this.parent = null),
            lt(t, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Jl(this);
        }
      }
      class Ms {
        constructor(e, t) {
          (this.path = e), (this.parameters = t);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = ro(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return nb(this);
        }
      }
      function oi(n, e) {
        return n.length === e.length && n.every((t, r) => t.path === e[r].path);
      }
      let Ts = (() => {
        class n {}
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({
            token: n,
            factory: function () {
              return new ah();
            },
            providedIn: "root",
          })),
          n
        );
      })();
      class ah {
        parse(e) {
          const t = new uk(e);
          return new ii(
            t.parseRootSegment(),
            t.parseQueryParams(),
            t.parseFragment()
          );
        }
        serialize(e) {
          const t = `/${Is(e.root, !0)}`,
            r = (function rk(n) {
              const e = Object.keys(n)
                .map((t) => {
                  const r = n[t];
                  return Array.isArray(r)
                    ? r.map((i) => `${eu(t)}=${eu(i)}`).join("&")
                    : `${eu(t)}=${eu(r)}`;
                })
                .filter((t) => !!t);
              return e.length ? `?${e.join("&")}` : "";
            })(e.queryParams);
          return `${t}${r}${
            "string" == typeof e.fragment
              ? `#${(function tk(n) {
                  return encodeURI(n);
                })(e.fragment)}`
              : ""
          }`;
        }
      }
      const ek = new ah();
      function Jl(n) {
        return n.segments.map((e) => nb(e)).join("/");
      }
      function Is(n, e) {
        if (!n.hasChildren()) return Jl(n);
        if (e) {
          const t = n.children[ee] ? Is(n.children[ee], !1) : "",
            r = [];
          return (
            lt(n.children, (i, o) => {
              o !== ee && r.push(`${o}:${Is(i, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join("//")})` : t
          );
        }
        {
          const t = (function JP(n, e) {
            let t = [];
            return (
              lt(n.children, (r, i) => {
                i === ee && (t = t.concat(e(r, i)));
              }),
              lt(n.children, (r, i) => {
                i !== ee && (t = t.concat(e(r, i)));
              }),
              t
            );
          })(n, (r, i) =>
            i === ee ? [Is(n.children[ee], !1)] : [`${i}:${Is(r, !1)}`]
          );
          return 1 === Object.keys(n.children).length && null != n.children[ee]
            ? `${Jl(n)}/${t[0]}`
            : `${Jl(n)}/(${t.join("//")})`;
        }
      }
      function eb(n) {
        return encodeURIComponent(n)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function eu(n) {
        return eb(n).replace(/%3B/gi, ";");
      }
      function lh(n) {
        return eb(n)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function tu(n) {
        return decodeURIComponent(n);
      }
      function tb(n) {
        return tu(n.replace(/\+/g, "%20"));
      }
      function nb(n) {
        return `${lh(n.path)}${(function nk(n) {
          return Object.keys(n)
            .map((e) => `;${lh(e)}=${lh(n[e])}`)
            .join("");
        })(n.parameters)}`;
      }
      const ik = /^[^\/()?;=#]+/;
      function nu(n) {
        const e = n.match(ik);
        return e ? e[0] : "";
      }
      const ok = /^[^=?&#]+/,
        ak = /^[^&#]+/;
      class uk {
        constructor(e) {
          (this.url = e), (this.remaining = e);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new ae([], {})
              : new ae([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const e = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(e);
            } while (this.consumeOptional("&"));
          return e;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const e = [];
          for (
            this.peekStartsWith("(") || e.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), e.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (e.length > 0 || Object.keys(t).length > 0) &&
              (r[ee] = new ae(e, t)),
            r
          );
        }
        parseSegment() {
          const e = nu(this.remaining);
          if ("" === e && this.peekStartsWith(";")) throw new T(4009, Xl);
          return this.capture(e), new Ms(tu(e), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const e = {};
          for (; this.consumeOptional(";"); ) this.parseParam(e);
          return e;
        }
        parseParam(e) {
          const t = nu(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = nu(this.remaining);
            i && ((r = i), this.capture(r));
          }
          e[tu(t)] = tu(r);
        }
        parseQueryParam(e) {
          const t = (function sk(n) {
            const e = n.match(ok);
            return e ? e[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function lk(n) {
              const e = n.match(ak);
              return e ? e[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = tb(t),
            o = tb(r);
          if (e.hasOwnProperty(i)) {
            let s = e[i];
            Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
          } else e[i] = o;
        }
        parseParens(e) {
          const t = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = nu(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new T(4010, Xl);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : e && (o = ee);
            const s = this.parseChildren();
            (t[o] = 1 === Object.keys(s).length ? s[ee] : new ae([], s)),
              this.consumeOptional("//");
          }
          return t;
        }
        peekStartsWith(e) {
          return this.remaining.startsWith(e);
        }
        consumeOptional(e) {
          return (
            !!this.peekStartsWith(e) &&
            ((this.remaining = this.remaining.substring(e.length)), !0)
          );
        }
        capture(e) {
          if (!this.consumeOptional(e)) throw new T(4011, Xl);
        }
      }
      function uh(n) {
        return n.segments.length > 0 ? new ae([], { [ee]: n }) : n;
      }
      function ru(n) {
        const e = {};
        for (const r of Object.keys(n.children)) {
          const o = ru(n.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
        }
        return (function ck(n) {
          if (1 === n.numberOfChildren && n.children[ee]) {
            const e = n.children[ee];
            return new ae(n.segments.concat(e.segments), e.children);
          }
          return n;
        })(new ae(n.segments, e));
      }
      function si(n) {
        return n instanceof ii;
      }
      function hk(n, e, t, r, i) {
        if (0 === t.length) return io(e.root, e.root, e.root, r, i);
        const o = (function ob(n) {
          if ("string" == typeof n[0] && 1 === n.length && "/" === n[0])
            return new ib(!0, 0, n);
          let e = 0,
            t = !1;
          const r = n.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  lt(o.outlets, (l, u) => {
                    a[u] = "string" == typeof l ? l.split("/") : l;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (t = !0)
                      : ".." === a
                      ? e++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new ib(t, e, r);
        })(t);
        return o.toRoot()
          ? io(e.root, e.root, new ae([], {}), r, i)
          : (function s(l) {
              const u = (function gk(n, e, t, r) {
                  if (n.isAbsolute) return new oo(e.root, !0, 0);
                  if (-1 === r) return new oo(t, t === e.root, 0);
                  return (function sb(n, e, t) {
                    let r = n,
                      i = e,
                      o = t;
                    for (; o > i; ) {
                      if (((o -= i), (r = r.parent), !r)) throw new T(4005, !1);
                      i = r.segments.length;
                    }
                    return new oo(r, !1, i - o);
                  })(t, r + (As(n.commands[0]) ? 0 : 1), n.numberOfDoubleDots);
                })(o, e, n.snapshot?._urlSegment, l),
                c = u.processChildren
                  ? so(u.segmentGroup, u.index, o.commands)
                  : dh(u.segmentGroup, u.index, o.commands);
              return io(e.root, u.segmentGroup, c, r, i);
            })(n.snapshot?._lastPathIndex);
      }
      function As(n) {
        return (
          "object" == typeof n && null != n && !n.outlets && !n.segmentPath
        );
      }
      function xs(n) {
        return "object" == typeof n && null != n && n.outlets;
      }
      function io(n, e, t, r, i) {
        let s,
          o = {};
        r &&
          lt(r, (l, u) => {
            o[u] = Array.isArray(l) ? l.map((c) => `${c}`) : `${l}`;
          }),
          (s = n === e ? t : rb(n, e, t));
        const a = uh(ru(s));
        return new ii(a, o, i);
      }
      function rb(n, e, t) {
        const r = {};
        return (
          lt(n.children, (i, o) => {
            r[o] = i === e ? t : rb(i, e, t);
          }),
          new ae(n.segments, r)
        );
      }
      class ib {
        constructor(e, t, r) {
          if (
            ((this.isAbsolute = e),
            (this.numberOfDoubleDots = t),
            (this.commands = r),
            e && r.length > 0 && As(r[0]))
          )
            throw new T(4003, !1);
          const i = r.find(xs);
          if (i && i !== KD(r)) throw new T(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class oo {
        constructor(e, t, r) {
          (this.segmentGroup = e), (this.processChildren = t), (this.index = r);
        }
      }
      function dh(n, e, t) {
        if (
          (n || (n = new ae([], {})),
          0 === n.segments.length && n.hasChildren())
        )
          return so(n, e, t);
        const r = (function _k(n, e, t) {
            let r = 0,
              i = e;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < n.segments.length; ) {
              if (r >= t.length) return o;
              const s = n.segments[i],
                a = t[r];
              if (xs(a)) break;
              const l = `${a}`,
                u = r < t.length - 1 ? t[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!lb(l, u, s)) return o;
                r += 2;
              } else {
                if (!lb(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(n, e, t),
          i = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < n.segments.length) {
          const o = new ae(n.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[ee] = new ae(
              n.segments.slice(r.pathIndex),
              n.children
            )),
            so(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new ae(n.segments, {})
          : r.match && !n.hasChildren()
          ? fh(n, e, t)
          : r.match
          ? so(n, 0, i)
          : fh(n, e, t);
      }
      function so(n, e, t) {
        if (0 === t.length) return new ae(n.segments, {});
        {
          const r = (function mk(n) {
              return xs(n[0]) ? n[0].outlets : { [ee]: n };
            })(t),
            i = {};
          return !r[ee] &&
            n.children[ee] &&
            1 === n.numberOfChildren &&
            0 === n.children[ee].segments.length
            ? so(n.children[ee], e, t)
            : (lt(r, (o, s) => {
                "string" == typeof o && (o = [o]),
                  null !== o && (i[s] = dh(n.children[s], e, o));
              }),
              lt(n.children, (o, s) => {
                void 0 === r[s] && (i[s] = o);
              }),
              new ae(n.segments, i));
        }
      }
      function fh(n, e, t) {
        const r = n.segments.slice(0, e);
        let i = 0;
        for (; i < t.length; ) {
          const o = t[i];
          if (xs(o)) {
            const l = yk(o.outlets);
            return new ae(r, l);
          }
          if (0 === i && As(t[0])) {
            r.push(new Ms(n.segments[e].path, ab(t[0]))), i++;
            continue;
          }
          const s = xs(o) ? o.outlets[ee] : `${o}`,
            a = i < t.length - 1 ? t[i + 1] : null;
          s && a && As(a)
            ? (r.push(new Ms(s, ab(a))), (i += 2))
            : (r.push(new Ms(s, {})), i++);
        }
        return new ae(r, {});
      }
      function yk(n) {
        const e = {};
        return (
          lt(n, (t, r) => {
            "string" == typeof t && (t = [t]),
              null !== t && (e[r] = fh(new ae([], {}), 0, t));
          }),
          e
        );
      }
      function ab(n) {
        const e = {};
        return lt(n, (t, r) => (e[r] = `${t}`)), e;
      }
      function lb(n, e, t) {
        return n == t.path && Un(e, t.parameters);
      }
      const Rs = "imperative";
      class Bn {
        constructor(e, t) {
          (this.id = e), (this.url = t);
        }
      }
      class hh extends Bn {
        constructor(e, t, r = "imperative", i = null) {
          super(e, t),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ai extends Bn {
        constructor(e, t, r) {
          super(e, t), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class iu extends Bn {
        constructor(e, t, r, i) {
          super(e, t), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ub extends Bn {
        constructor(e, t, r, i) {
          super(e, t), (this.reason = r), (this.code = i), (this.type = 16);
        }
      }
      class cb extends Bn {
        constructor(e, t, r, i) {
          super(e, t), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class vk extends Bn {
        constructor(e, t, r, i) {
          super(e, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Ck extends Bn {
        constructor(e, t, r, i) {
          super(e, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Dk extends Bn {
        constructor(e, t, r, i, o) {
          super(e, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class bk extends Bn {
        constructor(e, t, r, i) {
          super(e, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Ek extends Bn {
        constructor(e, t, r, i) {
          super(e, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class wk {
        constructor(e) {
          (this.route = e), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class Sk {
        constructor(e) {
          (this.route = e), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class Mk {
        constructor(e) {
          (this.snapshot = e), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Tk {
        constructor(e) {
          (this.snapshot = e), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Ik {
        constructor(e) {
          (this.snapshot = e), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Ak {
        constructor(e) {
          (this.snapshot = e), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class db {
        constructor(e, t, r) {
          (this.routerEvent = e),
            (this.position = t),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      let Rk = (() => {
          class n {
            createUrlTree(t, r, i, o, s, a) {
              return hk(t || r.root, i, o, s, a);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        Nk = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({
              token: n,
              factory: function (e) {
                return Rk.ɵfac(e);
              },
              providedIn: "root",
            })),
            n
          );
        })();
      class fb {
        constructor(e) {
          this._root = e;
        }
        get root() {
          return this._root.value;
        }
        parent(e) {
          const t = this.pathFromRoot(e);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(e) {
          const t = ph(e, this._root);
          return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(e) {
          const t = ph(e, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(e) {
          const t = gh(e, this._root);
          return t.length < 2
            ? []
            : t[t.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== e);
        }
        pathFromRoot(e) {
          return gh(e, this._root).map((t) => t.value);
        }
      }
      function ph(n, e) {
        if (n === e.value) return e;
        for (const t of e.children) {
          const r = ph(n, t);
          if (r) return r;
        }
        return null;
      }
      function gh(n, e) {
        if (n === e.value) return [e];
        for (const t of e.children) {
          const r = gh(n, t);
          if (r.length) return r.unshift(e), r;
        }
        return [];
      }
      class dr {
        constructor(e, t) {
          (this.value = e), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ao(n) {
        const e = {};
        return n && n.children.forEach((t) => (e[t.value.outlet] = t)), e;
      }
      class hb extends fb {
        constructor(e, t) {
          super(e), (this.snapshot = t), mh(this, e);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function pb(n, e) {
        const t = (function Fk(n, e) {
            const s = new ou([], {}, {}, "", {}, ee, e, null, n.root, -1, {});
            return new mb("", new dr(s, []));
          })(n, e),
          r = new wn([new Ms("", {})]),
          i = new wn({}),
          o = new wn({}),
          s = new wn({}),
          a = new wn(""),
          l = new lo(r, i, s, a, o, ee, e, t.root);
        return (l.snapshot = t.root), new hb(new dr(l, []), t);
      }
      class lo {
        constructor(e, t, r, i, o, s, a, l) {
          (this.url = e),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(re((u) => u[Ss])) ?? H(void 0)),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(re((e) => ro(e)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(re((e) => ro(e)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function gb(n, e = "emptyOnly") {
        const t = n.pathFromRoot;
        let r = 0;
        if ("always" !== e)
          for (r = t.length - 1; r >= 1; ) {
            const i = t[r],
              o = t[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function Pk(n) {
          return n.reduce(
            (e, t) => ({
              params: { ...e.params, ...t.params },
              data: { ...e.data, ...t.data },
              resolve: {
                ...t.data,
                ...e.resolve,
                ...t.routeConfig?.data,
                ...t._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(r));
      }
      class ou {
        get title() {
          return this.data?.[Ss];
        }
        constructor(e, t, r, i, o, s, a, l, u, c, d) {
          (this.url = e),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = ro(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = ro(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class mb extends fb {
        constructor(e, t) {
          super(t), (this.url = e), mh(this, t);
        }
        toString() {
          return _b(this._root);
        }
      }
      function mh(n, e) {
        (e.value._routerState = n), e.children.forEach((t) => mh(n, t));
      }
      function _b(n) {
        const e =
          n.children.length > 0 ? ` { ${n.children.map(_b).join(", ")} } ` : "";
        return `${n.value}${e}`;
      }
      function _h(n) {
        if (n.snapshot) {
          const e = n.snapshot,
            t = n._futureSnapshot;
          (n.snapshot = t),
            Un(e.queryParams, t.queryParams) ||
              n.queryParams.next(t.queryParams),
            e.fragment !== t.fragment && n.fragment.next(t.fragment),
            Un(e.params, t.params) || n.params.next(t.params),
            (function KP(n, e) {
              if (n.length !== e.length) return !1;
              for (let t = 0; t < n.length; ++t) if (!Un(n[t], e[t])) return !1;
              return !0;
            })(e.url, t.url) || n.url.next(t.url),
            Un(e.data, t.data) || n.data.next(t.data);
        } else
          (n.snapshot = n._futureSnapshot), n.data.next(n._futureSnapshot.data);
      }
      function yh(n, e) {
        const t =
          Un(n.params, e.params) &&
          (function ZP(n, e) {
            return (
              oi(n, e) && n.every((t, r) => Un(t.parameters, e[r].parameters))
            );
          })(n.url, e.url);
        return (
          t &&
          !(!n.parent != !e.parent) &&
          (!n.parent || yh(n.parent, e.parent))
        );
      }
      function Ns(n, e, t) {
        if (t && n.shouldReuseRoute(e.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = e.value;
          const i = (function Ok(n, e, t) {
            return e.children.map((r) => {
              for (const i of t.children)
                if (n.shouldReuseRoute(r.value, i.value.snapshot))
                  return Ns(n, r, i);
              return Ns(n, r);
            });
          })(n, e, t);
          return new dr(r, i);
        }
        {
          if (n.shouldAttach(e.value)) {
            const o = n.retrieve(e.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = e.value),
                (s.children = e.children.map((a) => Ns(n, a))),
                s
              );
            }
          }
          const r = (function Lk(n) {
              return new lo(
                new wn(n.url),
                new wn(n.params),
                new wn(n.queryParams),
                new wn(n.fragment),
                new wn(n.data),
                n.outlet,
                n.component,
                n
              );
            })(e.value),
            i = e.children.map((o) => Ns(n, o));
          return new dr(r, i);
        }
      }
      const vh = "ngNavigationCancelingError";
      function yb(n, e) {
        const { redirectTo: t, navigationBehaviorOptions: r } = si(e)
            ? { redirectTo: e, navigationBehaviorOptions: void 0 }
            : e,
          i = vb(!1, 0, e);
        return (i.url = t), (i.navigationBehaviorOptions = r), i;
      }
      function vb(n, e, t) {
        const r = new Error("NavigationCancelingError: " + (n || ""));
        return (r[vh] = !0), (r.cancellationCode = e), t && (r.url = t), r;
      }
      function Cb(n) {
        return Db(n) && si(n.url);
      }
      function Db(n) {
        return n && n[vh];
      }
      class Vk {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new Fs()),
            (this.attachRef = null);
        }
      }
      let Fs = (() => {
        class n {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, r) {
            const i = this.getOrCreateContext(t);
            (i.outlet = r), this.contexts.set(t, i);
          }
          onChildOutletDestroyed(t) {
            const r = this.getContext(t);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let r = this.getContext(t);
            return r || ((r = new Vk()), this.contexts.set(t, r)), r;
          }
          getContext(t) {
            return this.contexts.get(t) || null;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const su = !1;
      let Ch = (() => {
        class n {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = ee),
              (this.activateEvents = new he()),
              (this.deactivateEvents = new he()),
              (this.attachEvents = new he()),
              (this.detachEvents = new he()),
              (this.parentContexts = oe(Fs)),
              (this.location = oe(Cn)),
              (this.changeDetector = oe(Rl)),
              (this.environmentInjector = oe(Nn));
          }
          ngOnChanges(t) {
            if (t.name) {
              const { firstChange: r, previousValue: i } = t.name;
              if (r) return;
              this.isTrackedInParentContexts(i) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          isTrackedInParentContexts(t) {
            return this.parentContexts.getContext(t)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const t = this.parentContexts.getContext(this.name);
            t?.route &&
              (t.attachRef
                ? this.attach(t.attachRef, t.route)
                : this.activateWith(t.route, t.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new T(4012, su);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new T(4012, su);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new T(4012, su);
            this.location.detach();
            const t = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(t.instance),
              t
            );
          }
          attach(t, r) {
            (this.activated = t),
              (this._activatedRoute = r),
              this.location.insert(t.hostView),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, r) {
            if (this.isActivated) throw new T(4013, su);
            this._activatedRoute = t;
            const i = this.location,
              s = t.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new $k(t, a, i.injector);
            if (
              r &&
              (function Uk(n) {
                return !!n.resolveComponentFactory;
              })(r)
            ) {
              const u = r.resolveComponentFactory(s);
              this.activated = i.createComponent(u, i.length, l);
            } else
              this.activated = i.createComponent(s, {
                index: i.length,
                injector: l,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Yt],
          })),
          n
        );
      })();
      class $k {
        constructor(e, t, r) {
          (this.route = e), (this.childContexts = t), (this.parent = r);
        }
        get(e, t) {
          return e === lo
            ? this.route
            : e === Fs
            ? this.childContexts
            : this.parent.get(e, t);
        }
      }
      let Dh = (() => {
        class n {}
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵcmp = Ae({
            type: n,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [wv],
            decls: 1,
            vars: 0,
            template: function (t, r) {
              1 & t && B(0, "router-outlet");
            },
            dependencies: [Ch],
            encapsulation: 2,
          })),
          n
        );
      })();
      function bb(n, e) {
        return (
          n.providers &&
            !n._injector &&
            (n._injector = El(n.providers, e, `Route: ${n.path}`)),
          n._injector ?? e
        );
      }
      function Eh(n) {
        const e = n.children && n.children.map(Eh),
          t = e ? { ...n, children: e } : { ...n };
        return (
          !t.component &&
            !t.loadComponent &&
            (e || t.loadChildren) &&
            t.outlet &&
            t.outlet !== ee &&
            (t.component = Dh),
          t
        );
      }
      function rn(n) {
        return n.outlet || ee;
      }
      function Eb(n, e) {
        const t = n.filter((r) => rn(r) === e);
        return t.push(...n.filter((r) => rn(r) !== e)), t;
      }
      function Ps(n) {
        if (!n) return null;
        if (n.routeConfig?._injector) return n.routeConfig._injector;
        for (let e = n.parent; e; e = e.parent) {
          const t = e.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class zk {
        constructor(e, t, r, i) {
          (this.routeReuseStrategy = e),
            (this.futureState = t),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(e) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, e),
            _h(this.futureState.root),
            this.activateChildRoutes(t, r, e);
        }
        deactivateChildRoutes(e, t, r) {
          const i = ao(t);
          e.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            lt(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(e, t, r) {
          const i = e.value,
            o = t ? t.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(e, t, s.children);
            } else this.deactivateChildRoutes(e, t, r);
          else o && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(e, t) {
          e.value.component &&
          this.routeReuseStrategy.shouldDetach(e.value.snapshot)
            ? this.detachAndStoreRouteSubtree(e, t)
            : this.deactivateRouteAndOutlet(e, t);
        }
        detachAndStoreRouteSubtree(e, t) {
          const r = t.getContext(e.value.outlet),
            i = r && e.value.component ? r.children : t,
            o = ao(e);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(e.value.snapshot, {
              componentRef: s,
              route: e,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(e, t) {
          const r = t.getContext(e.value.outlet),
            i = r && e.value.component ? r.children : t,
            o = ao(e);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(e, t, r) {
          const i = ao(t);
          e.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new Ak(o.value.snapshot));
          }),
            e.children.length && this.forwardEvent(new Tk(e.value.snapshot));
        }
        activateRoutes(e, t, r) {
          const i = e.value,
            o = t ? t.value : null;
          if ((_h(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(e, t, s.children);
            } else this.activateChildRoutes(e, t, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                _h(a.route.value),
                this.activateChildRoutes(e, null, s.children);
            } else {
              const a = Ps(i.snapshot),
                l = a?.get(Jo) ?? null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = l),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(e, null, s.children);
            }
          } else this.activateChildRoutes(e, null, r);
        }
      }
      class wb {
        constructor(e) {
          (this.path = e), (this.route = this.path[this.path.length - 1]);
        }
      }
      class au {
        constructor(e, t) {
          (this.component = e), (this.route = t);
        }
      }
      function qk(n, e, t) {
        const r = n._root;
        return ks(r, e ? e._root : null, t, [r.value]);
      }
      function uo(n, e) {
        const t = Symbol(),
          r = e.get(n, t);
        return r === t
          ? "function" != typeof n ||
            (function qw(n) {
              return null !== Ta(n);
            })(n)
            ? e.get(n)
            : n
          : r;
      }
      function ks(
        n,
        e,
        t,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = ao(e);
        return (
          n.children.forEach((s) => {
            (function Kk(
              n,
              e,
              t,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = n.value,
                s = e ? e.value : null,
                a = t ? t.getContext(n.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function Qk(n, e, t) {
                  if ("function" == typeof t) return t(n, e);
                  switch (t) {
                    case "pathParamsChange":
                      return !oi(n.url, e.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !oi(n.url, e.url) || !Un(n.queryParams, e.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !yh(n, e) || !Un(n.queryParams, e.queryParams);
                    default:
                      return !yh(n, e);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new wb(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  ks(n, e, o.component ? (a ? a.children : null) : t, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new au(a.outlet.component, s));
              } else
                s && Os(e, a, i),
                  i.canActivateChecks.push(new wb(r)),
                  ks(n, null, o.component ? (a ? a.children : null) : t, r, i);
            })(s, o[s.value.outlet], t, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          lt(o, (s, a) => Os(s, t.getContext(a), i)),
          i
        );
      }
      function Os(n, e, t) {
        const r = ao(n),
          i = n.value;
        lt(r, (o, s) => {
          Os(o, i.component ? (e ? e.children.getContext(s) : null) : e, t);
        }),
          t.canDeactivateChecks.push(
            new au(
              i.component && e && e.outlet && e.outlet.isActivated
                ? e.outlet.component
                : null,
              i
            )
          );
      }
      function Ls(n) {
        return "function" == typeof n;
      }
      function wh(n) {
        return n instanceof Ql || "EmptyError" === n?.name;
      }
      const lu = Symbol("INITIAL_VALUE");
      function co() {
        return Sn((n) =>
          $D(
            n.map((e) =>
              e.pipe(
                ws(1),
                (function BP(...n) {
                  const e = Io(n);
                  return tt((t, r) => {
                    (e ? rh(n, t, e) : rh(n, t)).subscribe(r);
                  });
                })(lu)
              )
            )
          ).pipe(
            re((e) => {
              for (const t of e)
                if (!0 !== t) {
                  if (t === lu) return lu;
                  if (!1 === t || t instanceof ii) return t;
                }
              return !0;
            }),
            cr((e) => e !== lu),
            ws(1)
          )
        );
      }
      function Sb(n) {
        return (function dw(...n) {
          return kp(n);
        })(
          gt((e) => {
            if (si(e)) throw yb(0, e);
          }),
          re((e) => !0 === e)
        );
      }
      const Sh = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Mb(n, e, t, r, i) {
        const o = Mh(n, e, t);
        return o.matched
          ? (function fO(n, e, t, r) {
              const i = e.canMatch;
              return i && 0 !== i.length
                ? H(
                    i.map((s) => {
                      const a = uo(s, n);
                      return Ar(
                        (function tO(n) {
                          return n && Ls(n.canMatch);
                        })(a)
                          ? a.canMatch(e, t)
                          : n.runInContext(() => a(e, t))
                      );
                    })
                  ).pipe(co(), Sb())
                : H(!0);
            })((r = bb(e, r)), e, t).pipe(re((s) => (!0 === s ? o : { ...Sh })))
          : H(o);
      }
      function Mh(n, e, t) {
        if ("" === e.path)
          return "full" === e.pathMatch && (n.hasChildren() || t.length > 0)
            ? { ...Sh }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: t,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (e.matcher || WP)(t, n, e);
        if (!i) return { ...Sh };
        const o = {};
        lt(i.posParams, (a, l) => {
          o[l] = a.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: t.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function uu(n, e, t, r) {
        if (
          t.length > 0 &&
          (function gO(n, e, t) {
            return t.some((r) => cu(n, e, r) && rn(r) !== ee);
          })(n, t, r)
        ) {
          const o = new ae(
            e,
            (function pO(n, e, t, r) {
              const i = {};
              (i[ee] = r),
                (r._sourceSegment = n),
                (r._segmentIndexShift = e.length);
              for (const o of t)
                if ("" === o.path && rn(o) !== ee) {
                  const s = new ae([], {});
                  (s._sourceSegment = n),
                    (s._segmentIndexShift = e.length),
                    (i[rn(o)] = s);
                }
              return i;
            })(n, e, r, new ae(t, n.children))
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = e.length),
            { segmentGroup: o, slicedSegments: [] }
          );
        }
        if (
          0 === t.length &&
          (function mO(n, e, t) {
            return t.some((r) => cu(n, e, r));
          })(n, t, r)
        ) {
          const o = new ae(
            n.segments,
            (function hO(n, e, t, r, i) {
              const o = {};
              for (const s of r)
                if (cu(n, t, s) && !i[rn(s)]) {
                  const a = new ae([], {});
                  (a._sourceSegment = n),
                    (a._segmentIndexShift = e.length),
                    (o[rn(s)] = a);
                }
              return { ...i, ...o };
            })(n, e, t, r, n.children)
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = e.length),
            { segmentGroup: o, slicedSegments: t }
          );
        }
        const i = new ae(n.segments, n.children);
        return (
          (i._sourceSegment = n),
          (i._segmentIndexShift = e.length),
          { segmentGroup: i, slicedSegments: t }
        );
      }
      function cu(n, e, t) {
        return (
          (!(n.hasChildren() || e.length > 0) || "full" !== t.pathMatch) &&
          "" === t.path
        );
      }
      function Tb(n, e, t, r) {
        return (
          !!(rn(n) === r || (r !== ee && cu(e, t, n))) &&
          ("**" === n.path || Mh(e, n, t).matched)
        );
      }
      function Ib(n, e, t) {
        return 0 === e.length && !n.children[t];
      }
      const du = !1;
      class fu {
        constructor(e) {
          this.segmentGroup = e || null;
        }
      }
      class Ab {
        constructor(e) {
          this.urlTree = e;
        }
      }
      function Vs(n) {
        return Ie(new fu(n));
      }
      function xb(n) {
        return Ie(new Ab(n));
      }
      class CO {
        constructor(e, t, r, i, o) {
          (this.injector = e),
            (this.configLoader = t),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const e = uu(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new ae(e.segments, e.children);
          return this.expandSegmentGroup(this.injector, this.config, t, ee)
            .pipe(
              re((o) =>
                this.createUrlTree(
                  ru(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Ce((o) => {
                if (o instanceof Ab)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof fu ? this.noMatchError(o) : o;
              })
            );
        }
        match(e) {
          return this.expandSegmentGroup(this.injector, this.config, e.root, ee)
            .pipe(
              re((i) => this.createUrlTree(ru(i), e.queryParams, e.fragment))
            )
            .pipe(
              Ce((i) => {
                throw i instanceof fu ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(e) {
          return new T(4002, du);
        }
        createUrlTree(e, t, r) {
          const i = uh(e);
          return new ii(i, t, r);
        }
        expandSegmentGroup(e, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(e, t, r).pipe(re((o) => new ae([], o)))
            : this.expandSegment(e, r, t, r.segments, i, !0);
        }
        expandChildren(e, t, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return Be(i).pipe(
            Ir((o) => {
              const s = r.children[o],
                a = Eb(t, o);
              return this.expandSegmentGroup(e, a, s, o).pipe(
                re((l) => ({ segment: l, outlet: o }))
              );
            }),
            GD((o, s) => ((o[s.outlet] = s.segment), o), {}),
            zD()
          );
        }
        expandSegment(e, t, r, i, o, s) {
          return Be(r).pipe(
            Ir((a) =>
              this.expandSegmentAgainstRoute(e, t, r, a, i, o, s).pipe(
                Ce((u) => {
                  if (u instanceof fu) return H(null);
                  throw u;
                })
              )
            ),
            Tr((a) => !!a),
            Ce((a, l) => {
              if (wh(a)) return Ib(t, i, o) ? H(new ae([], {})) : Vs(t);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(e, t, r, i, o, s, a) {
          return Tb(i, t, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(e, t, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(e, t, r, i, o, s)
              : Vs(t)
            : Vs(t);
        }
        expandSegmentAgainstRouteUsingRedirect(e, t, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(e, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                e,
                t,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(e, t, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? xb(o)
            : this.lineralizeSegments(r, o).pipe(
                rt((s) => {
                  const a = new ae(s, {});
                  return this.expandSegment(e, a, t, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(e, t, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = Mh(t, i, o);
          if (!a) return Vs(t);
          const d = this.applyRedirectCommands(l, i.redirectTo, c);
          return i.redirectTo.startsWith("/")
            ? xb(d)
            : this.lineralizeSegments(i, d).pipe(
                rt((p) => this.expandSegment(e, t, r, p.concat(u), s, !1))
              );
        }
        matchSegmentAgainstRoute(e, t, r, i, o) {
          return "**" === r.path
            ? ((e = bb(r, e)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? H({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(e, r)
                  ).pipe(
                    re(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new ae(i, {})
                      )
                    )
                  )
                : H(new ae(i, {})))
            : Mb(t, r, i, e).pipe(
                Sn(
                  ({ matched: s, consumedSegments: a, remainingSegments: l }) =>
                    s
                      ? this.getChildConfig((e = r._injector ?? e), r, i).pipe(
                          rt((c) => {
                            const d = c.injector ?? e,
                              p = c.routes,
                              { segmentGroup: g, slicedSegments: m } = uu(
                                t,
                                a,
                                l,
                                p
                              ),
                              C = new ae(g.segments, g.children);
                            if (0 === m.length && C.hasChildren())
                              return this.expandChildren(d, p, C).pipe(
                                re((S) => new ae(a, S))
                              );
                            if (0 === p.length && 0 === m.length)
                              return H(new ae(a, {}));
                            const E = rn(r) === o;
                            return this.expandSegment(
                              d,
                              C,
                              p,
                              m,
                              E ? ee : o,
                              !0
                            ).pipe(
                              re(
                                (R) => new ae(a.concat(R.segments), R.children)
                              )
                            );
                          })
                        )
                      : Vs(t)
                )
              );
        }
        getChildConfig(e, t, r) {
          return t.children
            ? H({ routes: t.children, injector: e })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? H({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function dO(n, e, t, r) {
                  const i = e.canLoad;
                  return void 0 === i || 0 === i.length
                    ? H(!0)
                    : H(
                        i.map((s) => {
                          const a = uo(s, n);
                          return Ar(
                            (function Xk(n) {
                              return n && Ls(n.canLoad);
                            })(a)
                              ? a.canLoad(e, t)
                              : n.runInContext(() => a(e, t))
                          );
                        })
                      ).pipe(co(), Sb());
                })(e, t, r).pipe(
                  rt((i) =>
                    i
                      ? this.configLoader.loadChildren(e, t).pipe(
                          gt((o) => {
                            (t._loadedRoutes = o.routes),
                              (t._loadedInjector = o.injector);
                          })
                        )
                      : (function yO(n) {
                          return Ie(vb(du, 3));
                        })()
                  )
                )
            : H({ routes: [], injector: e });
        }
        lineralizeSegments(e, t) {
          let r = [],
            i = t.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return H(r);
            if (i.numberOfChildren > 1 || !i.children[ee])
              return Ie(new T(4e3, du));
            i = i.children[ee];
          }
        }
        applyRedirectCommands(e, t, r) {
          return this.applyRedirectCreateUrlTree(
            t,
            this.urlSerializer.parse(t),
            e,
            r
          );
        }
        applyRedirectCreateUrlTree(e, t, r, i) {
          const o = this.createSegmentGroup(e, t.root, r, i);
          return new ii(
            o,
            this.createQueryParams(t.queryParams, this.urlTree.queryParams),
            t.fragment
          );
        }
        createQueryParams(e, t) {
          const r = {};
          return (
            lt(e, (i, o) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = t[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(e, t, r, i) {
          const o = this.createSegments(e, t.segments, r, i);
          let s = {};
          return (
            lt(t.children, (a, l) => {
              s[l] = this.createSegmentGroup(e, a, r, i);
            }),
            new ae(o, s)
          );
        }
        createSegments(e, t, r, i) {
          return t.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(e, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(e, t, r) {
          const i = r[t.path.substring(1)];
          if (!i) throw new T(4001, du);
          return i;
        }
        findOrReturn(e, t) {
          let r = 0;
          for (const i of t) {
            if (i.path === e.path) return t.splice(r), i;
            r++;
          }
          return e;
        }
      }
      class bO {}
      class SO {
        constructor(e, t, r, i, o, s, a) {
          (this.injector = e),
            (this.rootComponentType = t),
            (this.config = r),
            (this.urlTree = i),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a);
        }
        recognize() {
          const e = uu(
            this.urlTree.root,
            [],
            [],
            this.config.filter((t) => void 0 === t.redirectTo)
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            e,
            ee
          ).pipe(
            re((t) => {
              if (null === t) return null;
              const r = new ou(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  ee,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                i = new dr(r, t),
                o = new mb(this.url, i);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(e) {
          const t = e.value,
            r = gb(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(r.params)),
            (t.data = Object.freeze(r.data)),
            e.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(e, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(e, t, r)
            : this.processSegment(e, t, r, r.segments, i);
        }
        processChildren(e, t, r) {
          return Be(Object.keys(r.children)).pipe(
            Ir((i) => {
              const o = r.children[i],
                s = Eb(t, i);
              return this.processSegmentGroup(e, s, o, i);
            }),
            GD((i, o) => (i && o ? (i.push(...o), i) : null)),
            (function GP(n, e = !1) {
              return tt((t, r) => {
                let i = 0;
                t.subscribe(
                  Ye(r, (o) => {
                    const s = n(o, i++);
                    (s || e) && r.next(o), !s && r.complete();
                  })
                );
              });
            })((i) => null !== i),
            Yl(null),
            zD(),
            re((i) => {
              if (null === i) return null;
              const o = Nb(i);
              return (
                (function MO(n) {
                  n.sort((e, t) =>
                    e.value.outlet === ee
                      ? -1
                      : t.value.outlet === ee
                      ? 1
                      : e.value.outlet.localeCompare(t.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(e, t, r, i, o) {
          return Be(t).pipe(
            Ir((s) =>
              this.processSegmentAgainstRoute(s._injector ?? e, s, r, i, o)
            ),
            Tr((s) => !!s),
            Ce((s) => {
              if (wh(s)) return Ib(r, i, o) ? H([]) : H(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(e, t, r, i, o) {
          if (t.redirectTo || !Tb(t, r, i, o)) return H(null);
          let s;
          if ("**" === t.path) {
            const a = i.length > 0 ? KD(i).parameters : {},
              l = Pb(r) + i.length;
            s = H({
              snapshot: new ou(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                kb(t),
                rn(t),
                t.component ?? t._loadedComponent ?? null,
                t,
                Fb(r),
                l,
                Ob(t)
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = Mb(r, t, i, e).pipe(
              re(
                ({
                  matched: a,
                  consumedSegments: l,
                  remainingSegments: u,
                  parameters: c,
                }) => {
                  if (!a) return null;
                  const d = Pb(r) + l.length;
                  return {
                    snapshot: new ou(
                      l,
                      c,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      kb(t),
                      rn(t),
                      t.component ?? t._loadedComponent ?? null,
                      t,
                      Fb(r),
                      d,
                      Ob(t)
                    ),
                    consumedSegments: l,
                    remainingSegments: u,
                  };
                }
              )
            );
          return s.pipe(
            Sn((a) => {
              if (null === a) return H(null);
              const {
                snapshot: l,
                consumedSegments: u,
                remainingSegments: c,
              } = a;
              e = t._injector ?? e;
              const d = t._loadedInjector ?? e,
                p = (function TO(n) {
                  return n.children
                    ? n.children
                    : n.loadChildren
                    ? n._loadedRoutes
                    : [];
                })(t),
                { segmentGroup: g, slicedSegments: m } = uu(
                  r,
                  u,
                  c,
                  p.filter((E) => void 0 === E.redirectTo)
                );
              if (0 === m.length && g.hasChildren())
                return this.processChildren(d, p, g).pipe(
                  re((E) => (null === E ? null : [new dr(l, E)]))
                );
              if (0 === p.length && 0 === m.length) return H([new dr(l, [])]);
              const C = rn(t) === o;
              return this.processSegment(d, p, g, m, C ? ee : o).pipe(
                re((E) => (null === E ? null : [new dr(l, E)]))
              );
            })
          );
        }
      }
      function IO(n) {
        const e = n.value.routeConfig;
        return e && "" === e.path && void 0 === e.redirectTo;
      }
      function Nb(n) {
        const e = [],
          t = new Set();
        for (const r of n) {
          if (!IO(r)) {
            e.push(r);
            continue;
          }
          const i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), t.add(i)) : e.push(r);
        }
        for (const r of t) {
          const i = Nb(r.children);
          e.push(new dr(r.value, i));
        }
        return e.filter((r) => !t.has(r));
      }
      function Fb(n) {
        let e = n;
        for (; e._sourceSegment; ) e = e._sourceSegment;
        return e;
      }
      function Pb(n) {
        let e = n,
          t = e._segmentIndexShift ?? 0;
        for (; e._sourceSegment; )
          (e = e._sourceSegment), (t += e._segmentIndexShift ?? 0);
        return t - 1;
      }
      function kb(n) {
        return n.data || {};
      }
      function Ob(n) {
        return n.resolve || {};
      }
      function Lb(n) {
        return "string" == typeof n.title || null === n.title;
      }
      function Th(n) {
        return Sn((e) => {
          const t = n(e);
          return t ? Be(t).pipe(re(() => e)) : H(e);
        });
      }
      const fo = new V("ROUTES");
      let Ih = (() => {
        class n {
          constructor(t, r) {
            (this.injector = t),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t))
              return this.componentLoaders.get(t);
            if (t._loadedComponent) return H(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const r = Ar(t.loadComponent()).pipe(
                re($b),
                gt((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(t),
                    (t._loadedComponent = o);
                }),
                sh(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              i = new jD(r, () => new Nt()).pipe(ih());
            return this.componentLoaders.set(t, i), i;
          }
          loadChildren(t, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return H({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                re((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l,
                    u,
                    c = !1;
                  Array.isArray(a)
                    ? (u = a)
                    : ((l = a.create(t).injector),
                      (u = WD(l.get(fo, [], q.Self | q.Optional))));
                  return { routes: u.map(Eh), injector: l };
                }),
                sh(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new jD(o, () => new Nt()).pipe(ih());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(t) {
            return Ar(t()).pipe(
              re($b),
              rt((i) =>
                i instanceof bv || Array.isArray(i)
                  ? H(i)
                  : Be(this.compiler.compileModuleAsync(i))
              )
            );
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Jt), N(gC));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function $b(n) {
        return (function LO(n) {
          return n && "object" == typeof n && "default" in n;
        })(n)
          ? n.default
          : n;
      }
      let pu = (() => {
        class n {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new Nt()),
              (this.configLoader = oe(Ih)),
              (this.environmentInjector = oe(Nn)),
              (this.urlSerializer = oe(Ts)),
              (this.rootContexts = oe(Fs)),
              (this.navigationId = 0),
              (this.afterPreactivation = () => H(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (i) =>
                this.events.next(new Sk(i))),
              (this.configLoader.onLoadStartListener = (i) =>
                this.events.next(new wk(i)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(t) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...t, id: r });
          }
          setupNavigations(t) {
            return (
              (this.transitions = new wn({
                id: 0,
                targetPageId: 0,
                currentUrlTree: t.currentUrlTree,
                currentRawUrl: t.currentUrlTree,
                extractedUrl: t.urlHandlingStrategy.extract(t.currentUrlTree),
                urlAfterRedirects: t.urlHandlingStrategy.extract(
                  t.currentUrlTree
                ),
                rawUrl: t.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Rs,
                restoredState: null,
                currentSnapshot: t.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: t.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                cr((r) => 0 !== r.id),
                re((r) => ({
                  ...r,
                  extractedUrl: t.urlHandlingStrategy.extract(r.rawUrl),
                })),
                Sn((r) => {
                  let i = !1,
                    o = !1;
                  return H(r).pipe(
                    gt((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Sn((s) => {
                      const a = t.browserUrlTree.toString(),
                        l =
                          !t.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== t.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            t.onSameUrlNavigation)
                      ) {
                        const c = "";
                        return (
                          this.events.next(
                            new ub(s.id, t.serializeUrl(r.rawUrl), c, 0)
                          ),
                          (t.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          In
                        );
                      }
                      if (t.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          Ub(s.source) && (t.browserUrlTree = s.extractedUrl),
                          H(s).pipe(
                            Sn((c) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new hh(
                                    c.id,
                                    this.urlSerializer.serialize(
                                      c.extractedUrl
                                    ),
                                    c.source,
                                    c.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? In
                                  : Promise.resolve(c)
                              );
                            }),
                            (function DO(n, e, t, r) {
                              return Sn((i) =>
                                (function vO(n, e, t, r, i) {
                                  return new CO(n, e, t, r, i).apply();
                                })(n, e, t, i.extractedUrl, r).pipe(
                                  re((o) => ({ ...i, urlAfterRedirects: o }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.urlSerializer,
                              t.config
                            ),
                            gt((c) => {
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: c.urlAfterRedirects,
                              }),
                                (r.urlAfterRedirects = c.urlAfterRedirects);
                            }),
                            (function xO(n, e, t, r, i) {
                              return rt((o) =>
                                (function wO(
                                  n,
                                  e,
                                  t,
                                  r,
                                  i,
                                  o,
                                  s = "emptyOnly"
                                ) {
                                  return new SO(n, e, t, r, i, s, o)
                                    .recognize()
                                    .pipe(
                                      Sn((a) =>
                                        null === a
                                          ? (function EO(n) {
                                              return new Ue((e) => e.error(n));
                                            })(new bO())
                                          : H(a)
                                      )
                                    );
                                })(
                                  n,
                                  e,
                                  t,
                                  o.urlAfterRedirects,
                                  r.serialize(o.urlAfterRedirects),
                                  r,
                                  i
                                ).pipe(re((s) => ({ ...o, targetSnapshot: s })))
                              );
                            })(
                              this.environmentInjector,
                              this.rootComponentType,
                              t.config,
                              this.urlSerializer,
                              t.paramsInheritanceStrategy
                            ),
                            gt((c) => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                "eager" === t.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const p = t.urlHandlingStrategy.merge(
                                    c.urlAfterRedirects,
                                    c.rawUrl
                                  );
                                  t.setBrowserUrl(p, c);
                                }
                                t.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new vk(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(
                                  c.urlAfterRedirects
                                ),
                                c.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        t.urlHandlingStrategy.shouldProcessUrl(t.rawUrlTree)
                      ) {
                        const {
                            id: c,
                            extractedUrl: d,
                            source: p,
                            restoredState: g,
                            extras: m,
                          } = s,
                          C = new hh(c, this.urlSerializer.serialize(d), p, g);
                        this.events.next(C);
                        const E = pb(d, this.rootComponentType).snapshot;
                        return H(
                          (r = {
                            ...s,
                            targetSnapshot: E,
                            urlAfterRedirects: d,
                            extras: {
                              ...m,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const c = "";
                        return (
                          this.events.next(
                            new ub(s.id, t.serializeUrl(r.extractedUrl), c, 1)
                          ),
                          (t.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          In
                        );
                      }
                    }),
                    gt((s) => {
                      const a = new Ck(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    re(
                      (s) =>
                        (r = {
                          ...s,
                          guards: qk(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function rO(n, e) {
                      return rt((t) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: o,
                            canDeactivateChecks: s,
                          },
                        } = t;
                        return 0 === s.length && 0 === o.length
                          ? H({ ...t, guardsResult: !0 })
                          : (function iO(n, e, t, r) {
                              return Be(n).pipe(
                                rt((i) =>
                                  (function cO(n, e, t, r, i) {
                                    const o =
                                      e && e.routeConfig
                                        ? e.routeConfig.canDeactivate
                                        : null;
                                    return o && 0 !== o.length
                                      ? H(
                                          o.map((a) => {
                                            const l = Ps(e) ?? i,
                                              u = uo(a, l);
                                            return Ar(
                                              (function eO(n) {
                                                return n && Ls(n.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(n, e, t, r)
                                                : l.runInContext(() =>
                                                    u(n, e, t, r)
                                                  )
                                            ).pipe(Tr());
                                          })
                                        ).pipe(co())
                                      : H(!0);
                                  })(i.component, i.route, t, e, r)
                                ),
                                Tr((i) => !0 !== i, !0)
                              );
                            })(s, r, i, n).pipe(
                              rt((a) =>
                                a &&
                                (function Yk(n) {
                                  return "boolean" == typeof n;
                                })(a)
                                  ? (function oO(n, e, t, r) {
                                      return Be(e).pipe(
                                        Ir((i) =>
                                          rh(
                                            (function aO(n, e) {
                                              return (
                                                null !== n && e && e(new Mk(n)),
                                                H(!0)
                                              );
                                            })(i.route.parent, r),
                                            (function sO(n, e) {
                                              return (
                                                null !== n && e && e(new Ik(n)),
                                                H(!0)
                                              );
                                            })(i.route, r),
                                            (function uO(n, e, t) {
                                              const r = e[e.length - 1],
                                                o = e
                                                  .slice(0, e.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function Wk(n) {
                                                      const e = n.routeConfig
                                                        ? n.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return e && 0 !== e.length
                                                        ? { node: n, guards: e }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    BD(() =>
                                                      H(
                                                        s.guards.map((l) => {
                                                          const u =
                                                              Ps(s.node) ?? t,
                                                            c = uo(l, u);
                                                          return Ar(
                                                            (function Jk(n) {
                                                              return (
                                                                n &&
                                                                Ls(
                                                                  n.canActivateChild
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  r,
                                                                  n
                                                                )
                                                              : u.runInContext(
                                                                  () => c(r, n)
                                                                )
                                                          ).pipe(Tr());
                                                        })
                                                      ).pipe(co())
                                                    )
                                                  );
                                              return H(o).pipe(co());
                                            })(n, i.path, t),
                                            (function lO(n, e, t) {
                                              const r = e.routeConfig
                                                ? e.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return H(!0);
                                              const i = r.map((o) =>
                                                BD(() => {
                                                  const s = Ps(e) ?? t,
                                                    a = uo(o, s);
                                                  return Ar(
                                                    (function Zk(n) {
                                                      return (
                                                        n && Ls(n.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(e, n)
                                                      : s.runInContext(() =>
                                                          a(e, n)
                                                        )
                                                  ).pipe(Tr());
                                                })
                                              );
                                              return H(i).pipe(co());
                                            })(n, i.route, t)
                                          )
                                        ),
                                        Tr((i) => !0 !== i, !0)
                                      );
                                    })(r, o, n, e)
                                  : H(a)
                              ),
                              re((a) => ({ ...t, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    gt((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), si(s.guardsResult))
                      )
                        throw yb(0, s.guardsResult);
                      const a = new Dk(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    cr(
                      (s) =>
                        !!s.guardsResult ||
                        (t.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    Th((s) => {
                      if (s.guards.canActivateChecks.length)
                        return H(s).pipe(
                          gt((a) => {
                            const l = new bk(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Sn((a) => {
                            let l = !1;
                            return H(a).pipe(
                              (function RO(n, e) {
                                return rt((t) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: i },
                                  } = t;
                                  if (!i.length) return H(t);
                                  let o = 0;
                                  return Be(i).pipe(
                                    Ir((s) =>
                                      (function NO(n, e, t, r) {
                                        const i = n.routeConfig,
                                          o = n._resolve;
                                        return (
                                          void 0 !== i?.title &&
                                            !Lb(i) &&
                                            (o[Ss] = i.title),
                                          (function FO(n, e, t, r) {
                                            const i = (function PO(n) {
                                              return [
                                                ...Object.keys(n),
                                                ...Object.getOwnPropertySymbols(
                                                  n
                                                ),
                                              ];
                                            })(n);
                                            if (0 === i.length) return H({});
                                            const o = {};
                                            return Be(i).pipe(
                                              rt((s) =>
                                                (function kO(n, e, t, r) {
                                                  const i = Ps(e) ?? r,
                                                    o = uo(n, i);
                                                  return Ar(
                                                    o.resolve
                                                      ? o.resolve(e, t)
                                                      : i.runInContext(() =>
                                                          o(e, t)
                                                        )
                                                  );
                                                })(n[s], e, t, r).pipe(
                                                  Tr(),
                                                  gt((a) => {
                                                    o[s] = a;
                                                  })
                                                )
                                              ),
                                              oh(1),
                                              (function zP(n) {
                                                return re(() => n);
                                              })(o),
                                              Ce((s) => (wh(s) ? In : Ie(s)))
                                            );
                                          })(o, n, e, r).pipe(
                                            re(
                                              (s) => (
                                                (n._resolvedData = s),
                                                (n.data = gb(n, t).resolve),
                                                i &&
                                                  Lb(i) &&
                                                  (n.data[Ss] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, n, e)
                                    ),
                                    gt(() => o++),
                                    oh(1),
                                    rt((s) => (o === i.length ? H(t) : In))
                                  );
                                });
                              })(
                                t.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              gt({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (t.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          gt((a) => {
                            const l = new Ek(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    Th((s) => {
                      const a = (l) => {
                        const u = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          u.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              gt((c) => {
                                l.component = c;
                              }),
                              re(() => {})
                            )
                          );
                        for (const c of l.children) u.push(...a(c));
                        return u;
                      };
                      return $D(a(s.targetSnapshot.root)).pipe(Yl(), ws(1));
                    }),
                    Th(() => this.afterPreactivation()),
                    re((s) => {
                      const a = (function kk(n, e, t) {
                        const r = Ns(n, e._root, t ? t._root : void 0);
                        return new hb(r, e);
                      })(
                        t.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    gt((s) => {
                      (t.currentUrlTree = s.urlAfterRedirects),
                        (t.rawUrlTree = t.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (t.routerState = s.targetRouterState),
                        "deferred" === t.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            t.setBrowserUrl(t.rawUrlTree, s),
                          (t.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((n, e, t) =>
                      re(
                        (r) => (
                          new zk(
                            e,
                            r.targetRouterState,
                            r.currentRouterState,
                            t
                          ).activate(n),
                          r
                        )
                      ))(this.rootContexts, t.routeReuseStrategy, (s) =>
                      this.events.next(s)
                    ),
                    gt({
                      next: (s) => {
                        (i = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (t.navigated = !0),
                          this.events.next(
                            new ai(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(t.currentUrlTree)
                            )
                          ),
                          t.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    sh(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Ce((s) => {
                      if (((o = !0), Db(s))) {
                        Cb(s) || ((t.navigated = !0), t.restoreHistory(r, !0));
                        const a = new iu(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), Cb(s))) {
                          const l = t.urlHandlingStrategy.merge(
                              s.url,
                              t.rawUrlTree
                            ),
                            u = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === t.urlUpdateStrategy || Ub(r.source),
                            };
                          t.scheduleNavigation(l, Rs, null, u, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        t.restoreHistory(r, !0);
                        const a = new cb(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(t.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return In;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(t, r, i) {
            const o = new iu(
              t.id,
              this.urlSerializer.serialize(t.extractedUrl),
              r,
              i
            );
            this.events.next(o), t.resolve(!1);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function Ub(n) {
        return n !== Rs;
      }
      let Bb = (() => {
          class n {
            buildTitle(t) {
              let r,
                i = t.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === ee));
              return r;
            }
            getResolvedTitleForRoute(t) {
              return t.data[Ss];
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({
              token: n,
              factory: function () {
                return oe(VO);
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        VO = (() => {
          class n extends Bb {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const r = this.buildTitle(t);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(N(FD));
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        $O = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({
              token: n,
              factory: function () {
                return oe(BO);
              },
              providedIn: "root",
            })),
            n
          );
        })();
      class UO {
        shouldDetach(e) {
          return !1;
        }
        store(e, t) {}
        shouldAttach(e) {
          return !1;
        }
        retrieve(e) {
          return null;
        }
        shouldReuseRoute(e, t) {
          return e.routeConfig === t.routeConfig;
        }
      }
      let BO = (() => {
        class n extends UO {}
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const gu = new V("", { providedIn: "root", factory: () => ({}) });
      let HO = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({
              token: n,
              factory: function () {
                return oe(GO);
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        GO = (() => {
          class n {
            shouldProcessUrl(t) {
              return !0;
            }
            extract(t) {
              return t;
            }
            merge(t, r) {
              return t;
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })();
      function zO(n) {
        throw n;
      }
      function qO(n, e, t) {
        return e.parse("/");
      }
      const WO = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        KO = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let ut = (() => {
          class n {
            get navigationId() {
              return this.navigationTransitions.navigationId;
            }
            get browserPageId() {
              return this.location.getState()?.ɵrouterPageId;
            }
            get events() {
              return this.navigationTransitions.events;
            }
            constructor() {
              (this.disposed = !1),
                (this.currentPageId = 0),
                (this.console = oe(CR)),
                (this.isNgZoneEnabled = !1),
                (this.options = oe(gu, { optional: !0 }) || {}),
                (this.errorHandler = this.options.errorHandler || zO),
                (this.malformedUriErrorHandler =
                  this.options.malformedUriErrorHandler || qO),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1),
                (this.urlHandlingStrategy = oe(HO)),
                (this.routeReuseStrategy = oe($O)),
                (this.urlCreationStrategy = oe(Nk)),
                (this.titleStrategy = oe(Bb)),
                (this.onSameUrlNavigation =
                  this.options.onSameUrlNavigation || "ignore"),
                (this.paramsInheritanceStrategy =
                  this.options.paramsInheritanceStrategy || "emptyOnly"),
                (this.urlUpdateStrategy =
                  this.options.urlUpdateStrategy || "deferred"),
                (this.canceledNavigationResolution =
                  this.options.canceledNavigationResolution || "replace"),
                (this.config = WD(oe(fo, { optional: !0 }) ?? [])),
                (this.navigationTransitions = oe(pu)),
                (this.urlSerializer = oe(Ts)),
                (this.location = oe(Ff)),
                (this.isNgZoneEnabled =
                  oe(Ve) instanceof Ve && Ve.isInAngularZone()),
                this.resetConfig(this.config),
                (this.currentUrlTree = new ii()),
                (this.rawUrlTree = this.currentUrlTree),
                (this.browserUrlTree = this.currentUrlTree),
                (this.routerState = pb(this.currentUrlTree, null)),
                this.navigationTransitions.setupNavigations(this).subscribe(
                  (t) => {
                    (this.lastSuccessfulId = t.id),
                      (this.currentPageId = t.targetPageId);
                  },
                  (t) => {
                    this.console.warn(`Unhandled Navigation Error: ${t}`);
                  }
                );
            }
            resetRootComponentType(t) {
              (this.routerState.root.component = t),
                (this.navigationTransitions.rootComponentType = t);
            }
            initialNavigation() {
              if (
                (this.setUpLocationChangeListener(),
                !this.navigationTransitions.hasRequestedNavigation)
              ) {
                const t = this.location.getState();
                this.navigateToSyncWithBrowser(this.location.path(!0), Rs, t);
              }
            }
            setUpLocationChangeListener() {
              this.locationSubscription ||
                (this.locationSubscription = this.location.subscribe((t) => {
                  const r = "popstate" === t.type ? "popstate" : "hashchange";
                  "popstate" === r &&
                    setTimeout(() => {
                      this.navigateToSyncWithBrowser(t.url, r, t.state);
                    }, 0);
                }));
            }
            navigateToSyncWithBrowser(t, r, i) {
              const o = { replaceUrl: !0 },
                s = i?.navigationId ? i : null;
              if (i) {
                const l = { ...i };
                delete l.navigationId,
                  delete l.ɵrouterPageId,
                  0 !== Object.keys(l).length && (o.state = l);
              }
              const a = this.parseUrl(t);
              this.scheduleNavigation(a, r, s, o);
            }
            get url() {
              return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
              return this.navigationTransitions.currentNavigation;
            }
            resetConfig(t) {
              (this.config = t.map(Eh)),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1);
            }
            ngOnDestroy() {
              this.dispose();
            }
            dispose() {
              this.navigationTransitions.complete(),
                this.locationSubscription &&
                  (this.locationSubscription.unsubscribe(),
                  (this.locationSubscription = void 0)),
                (this.disposed = !0);
            }
            createUrlTree(t, r = {}) {
              const {
                  relativeTo: i,
                  queryParams: o,
                  fragment: s,
                  queryParamsHandling: a,
                  preserveFragment: l,
                } = r,
                u = l ? this.currentUrlTree.fragment : s;
              let c = null;
              switch (a) {
                case "merge":
                  c = { ...this.currentUrlTree.queryParams, ...o };
                  break;
                case "preserve":
                  c = this.currentUrlTree.queryParams;
                  break;
                default:
                  c = o || null;
              }
              return (
                null !== c && (c = this.removeEmptyProps(c)),
                this.urlCreationStrategy.createUrlTree(
                  i,
                  this.routerState,
                  this.currentUrlTree,
                  t,
                  c,
                  u ?? null
                )
              );
            }
            navigateByUrl(t, r = { skipLocationChange: !1 }) {
              const i = si(t) ? t : this.parseUrl(t),
                o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
              return this.scheduleNavigation(o, Rs, null, r);
            }
            navigate(t, r = { skipLocationChange: !1 }) {
              return (
                (function QO(n) {
                  for (let e = 0; e < n.length; e++) {
                    if (null == n[e]) throw new T(4008, !1);
                  }
                })(t),
                this.navigateByUrl(this.createUrlTree(t, r), r)
              );
            }
            serializeUrl(t) {
              return this.urlSerializer.serialize(t);
            }
            parseUrl(t) {
              let r;
              try {
                r = this.urlSerializer.parse(t);
              } catch (i) {
                r = this.malformedUriErrorHandler(i, this.urlSerializer, t);
              }
              return r;
            }
            isActive(t, r) {
              let i;
              if (
                ((i = !0 === r ? { ...WO } : !1 === r ? { ...KO } : r), si(t))
              )
                return YD(this.currentUrlTree, t, i);
              const o = this.parseUrl(t);
              return YD(this.currentUrlTree, o, i);
            }
            removeEmptyProps(t) {
              return Object.keys(t).reduce((r, i) => {
                const o = t[i];
                return null != o && (r[i] = o), r;
              }, {});
            }
            scheduleNavigation(t, r, i, o, s) {
              if (this.disposed) return Promise.resolve(!1);
              let a, l, u, c;
              return (
                s
                  ? ((a = s.resolve), (l = s.reject), (u = s.promise))
                  : (u = new Promise((d, p) => {
                      (a = d), (l = p);
                    })),
                (c =
                  "computed" === this.canceledNavigationResolution
                    ? i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1
                    : 0),
                this.navigationTransitions.handleNavigationRequest({
                  targetPageId: c,
                  source: r,
                  restoredState: i,
                  currentUrlTree: this.currentUrlTree,
                  currentRawUrl: this.currentUrlTree,
                  rawUrl: t,
                  extras: o,
                  resolve: a,
                  reject: l,
                  promise: u,
                  currentSnapshot: this.routerState.snapshot,
                  currentRouterState: this.routerState,
                }),
                u.catch((d) => Promise.reject(d))
              );
            }
            setBrowserUrl(t, r) {
              const i = this.urlSerializer.serialize(t),
                o = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, r.targetPageId),
                };
              this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
                ? this.location.replaceState(i, "", o)
                : this.location.go(i, "", o);
            }
            restoreHistory(t, r = !1) {
              if ("computed" === this.canceledNavigationResolution) {
                const i = this.currentPageId - t.targetPageId;
                ("popstate" !== t.source &&
                  "eager" !== this.urlUpdateStrategy &&
                  this.currentUrlTree !==
                    this.getCurrentNavigation()?.finalUrl) ||
                0 === i
                  ? this.currentUrlTree ===
                      this.getCurrentNavigation()?.finalUrl &&
                    0 === i &&
                    (this.resetState(t),
                    (this.browserUrlTree = t.currentUrlTree),
                    this.resetUrlToCurrentUrlTree())
                  : this.location.historyGo(i);
              } else
                "replace" === this.canceledNavigationResolution &&
                  (r && this.resetState(t), this.resetUrlToCurrentUrlTree());
            }
            resetState(t) {
              (this.routerState = t.currentRouterState),
                (this.currentUrlTree = t.currentUrlTree),
                (this.rawUrlTree = this.urlHandlingStrategy.merge(
                  this.currentUrlTree,
                  t.rawUrl
                ));
            }
            resetUrlToCurrentUrlTree() {
              this.location.replaceState(
                this.urlSerializer.serialize(this.rawUrlTree),
                "",
                this.generateNgRouterState(
                  this.lastSuccessfulId,
                  this.currentPageId
                )
              );
            }
            generateNgRouterState(t, r) {
              return "computed" === this.canceledNavigationResolution
                ? { navigationId: t, ɵrouterPageId: r }
                : { navigationId: t };
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        ho = (() => {
          class n {
            constructor(t, r, i, o, s, a) {
              (this.router = t),
                (this.route = r),
                (this.tabIndexAttribute = i),
                (this.renderer = o),
                (this.el = s),
                (this.locationStrategy = a),
                (this._preserveFragment = !1),
                (this._skipLocationChange = !1),
                (this._replaceUrl = !1),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new Nt());
              const l = s.nativeElement.tagName;
              (this.isAnchorElement = "A" === l || "AREA" === l),
                this.isAnchorElement
                  ? (this.subscription = t.events.subscribe((u) => {
                      u instanceof ai && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            set preserveFragment(t) {
              this._preserveFragment = no(t);
            }
            get preserveFragment() {
              return this._preserveFragment;
            }
            set skipLocationChange(t) {
              this._skipLocationChange = no(t);
            }
            get skipLocationChange() {
              return this._skipLocationChange;
            }
            set replaceUrl(t) {
              this._replaceUrl = no(t);
            }
            get replaceUrl() {
              return this._replaceUrl;
            }
            setTabIndexIfNotOnNativeEl(t) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", t);
            }
            ngOnChanges(t) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(t) {
              null != t
                ? ((this.commands = Array.isArray(t) ? t : [t]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(t, r, i, o, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== t ||
                      r ||
                      i ||
                      o ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const t =
                null === this.href
                  ? null
                  : (function Qm(n, e, t) {
                      return (function CM(n, e) {
                        return ("src" === e &&
                          ("embed" === n ||
                            "frame" === n ||
                            "iframe" === n ||
                            "media" === n ||
                            "script" === n)) ||
                          ("href" === e && ("base" === n || "link" === n))
                          ? Km
                          : Wm;
                      })(
                        e,
                        t
                      )(n);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", t);
            }
            applyAttributeValue(t, r) {
              const i = this.renderer,
                o = this.el.nativeElement;
              null !== r ? i.setAttribute(o, t, r) : i.removeAttribute(o, t);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(
                M(ut),
                M(lo),
                (function Wa(n) {
                  return (function GS(n, e) {
                    if ("class" === e) return n.classes;
                    if ("style" === e) return n.styles;
                    const t = n.attrs;
                    if (t) {
                      const r = t.length;
                      let i = 0;
                      for (; i < r; ) {
                        const o = t[i];
                        if (Vg(o)) break;
                        if (0 === o) i += 2;
                        else if ("number" == typeof o)
                          for (i++; i < r && "string" == typeof t[i]; ) i++;
                        else {
                          if (o === e) return t[i + 1];
                          i += 2;
                        }
                      }
                    }
                    return null;
                  })(ot(), n);
                })("tabindex"),
                M(nr),
                M(Ut),
                M(ri)
              );
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (t, r) {
                1 & t &&
                  x("click", function (o) {
                    return r.onClick(
                      o.button,
                      o.ctrlKey,
                      o.shiftKey,
                      o.altKey,
                      o.metaKey
                    );
                  }),
                  2 & t && kn("target", r.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [Yt],
            })),
            n
          );
        })(),
        Ah = (() => {
          class n {
            get isActive() {
              return this._isActive;
            }
            constructor(t, r, i, o, s) {
              (this.router = t),
                (this.element = r),
                (this.renderer = i),
                (this.cdr = o),
                (this.link = s),
                (this.classes = []),
                (this._isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new he()),
                (this.routerEventsSubscription = t.events.subscribe((a) => {
                  a instanceof ai && this.update();
                }));
            }
            ngAfterContentInit() {
              H(this.links.changes, H(null))
                .pipe(_i())
                .subscribe((t) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const t = [...this.links.toArray(), this.link]
                .filter((r) => !!r)
                .map((r) => r.onChanges);
              this.linkInputChangesSubscription = Be(t)
                .pipe(_i())
                .subscribe((r) => {
                  this._isActive !== this.isLinkActive(this.router)(r) &&
                    this.update();
                });
            }
            set routerLinkActive(t) {
              const r = Array.isArray(t) ? t : t.split(" ");
              this.classes = r.filter((i) => !!i);
            }
            ngOnChanges(t) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(),
                this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.router.navigated ||
                Promise.resolve().then(() => {
                  const t = this.hasActiveLinks();
                  this._isActive !== t &&
                    ((this._isActive = t),
                    this.cdr.markForCheck(),
                    this.classes.forEach((r) => {
                      t
                        ? this.renderer.addClass(this.element.nativeElement, r)
                        : this.renderer.removeClass(
                            this.element.nativeElement,
                            r
                          );
                    }),
                    t && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          "aria-current",
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(
                          this.element.nativeElement,
                          "aria-current"
                        ),
                    this.isActiveChange.emit(t));
                });
            }
            isLinkActive(t) {
              const r = (function YO(n) {
                return !!n.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (i) => !!i.urlTree && t.isActive(i.urlTree, r);
            }
            hasActiveLinks() {
              const t = this.isLinkActive(this.router);
              return (this.link && t(this.link)) || this.links.some(t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(ut), M(Ut), M(nr), M(Rl), M(ho, 8));
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [["", "routerLinkActive", ""]],
              contentQueries: function (t, r, i) {
                if ((1 & t && jv(i, ho, 5), 2 & t)) {
                  let o;
                  Bv(
                    (o = (function Hv() {
                      return (function Jx(n, e) {
                        return n[19].queries[e].queryList;
                      })(A(), Rg());
                    })())
                  ) && (r.links = o);
                }
              },
              inputs: {
                routerLinkActiveOptions: "routerLinkActiveOptions",
                ariaCurrentWhenActive: "ariaCurrentWhenActive",
                routerLinkActive: "routerLinkActive",
              },
              outputs: { isActiveChange: "isActiveChange" },
              exportAs: ["routerLinkActive"],
              standalone: !0,
              features: [Yt],
            })),
            n
          );
        })();
      class Hb {}
      let XO = (() => {
        class n {
          constructor(t, r, i, o, s) {
            (this.router = t),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                cr((t) => t instanceof ai),
                Ir(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = El(o.providers, t, `Route: ${o.path}`));
              const s = o._injector ?? t,
                a = o._loadedInjector ?? s;
              (o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
              (o.loadComponent && !o._loadedComponent)
                ? i.push(this.preloadConfig(s, o))
                : (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return Be(i).pipe(_i());
          }
          preloadConfig(t, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(t, r)
                  : H(null);
              const o = i.pipe(
                rt((s) =>
                  null === s
                    ? H(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? Be([o, this.loader.loadComponent(r)]).pipe(_i())
                : o;
            });
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(ut), N(gC), N(Nn), N(Hb), N(Ih));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const xh = new V("");
      let Gb = (() => {
        class n {
          constructor(t, r, i, o, s = {}) {
            (this.urlSerializer = t),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof hh
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState
                    ? t.restoredState.navigationId
                    : 0))
                : t instanceof ai &&
                  ((this.lastId = t.id),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof db &&
                (t.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(t.position)
                  : t.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(t.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(t, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new db(
                      t,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (n.ɵfac = function (t) {
            !(function S_() {
              throw new Error("invalid");
            })();
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function li(n, e) {
        return { ɵkind: n, ɵproviders: e };
      }
      function qb() {
        const n = oe(Jt);
        return (e) => {
          const t = n.get(_s);
          if (e !== t.components[0]) return;
          const r = n.get(ut),
            i = n.get(Wb);
          1 === n.get(Nh) && r.initialNavigation(),
            n.get(Kb, null, q.Optional)?.setUpPreloading(),
            n.get(xh, null, q.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            i.closed || (i.next(), i.unsubscribe());
        };
      }
      const Wb = new V("", { factory: () => new Nt() }),
        Nh = new V("", { providedIn: "root", factory: () => 1 });
      const Kb = new V("");
      function n2(n) {
        return li(0, [
          { provide: Kb, useExisting: XO },
          { provide: Hb, useExisting: n },
        ]);
      }
      const Qb = new V("ROUTER_FORROOT_GUARD"),
        r2 = [
          Ff,
          { provide: Ts, useClass: ah },
          ut,
          Fs,
          {
            provide: lo,
            useFactory: function zb(n) {
              return n.routerState.root;
            },
            deps: [ut],
          },
          Ih,
          [],
        ];
      function i2() {
        return new bC("Router", ut);
      }
      let Yb = (() => {
        class n {
          constructor(t) {}
          static forRoot(t, r) {
            return {
              ngModule: n,
              providers: [
                r2,
                [],
                { provide: fo, multi: !0, useValue: t },
                {
                  provide: Qb,
                  useFactory: l2,
                  deps: [[ut, new Ho(), new Go()]],
                },
                { provide: gu, useValue: r || {} },
                r?.useHash
                  ? { provide: ri, useClass: aN }
                  : { provide: ri, useClass: zC },
                {
                  provide: xh,
                  useFactory: () => {
                    const n = oe(MF),
                      e = oe(Ve),
                      t = oe(gu),
                      r = oe(pu),
                      i = oe(Ts);
                    return (
                      t.scrollOffset && n.setOffset(t.scrollOffset),
                      new Gb(i, r, n, e, t)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? n2(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: bC, multi: !0, useFactory: i2 },
                r?.initialNavigation ? u2(r) : [],
                [
                  { provide: Xb, useFactory: qb },
                  { provide: hC, multi: !0, useExisting: Xb },
                ],
              ],
            };
          }
          static forChild(t) {
            return {
              ngModule: n,
              providers: [{ provide: fo, multi: !0, useValue: t }],
            };
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Qb, 8));
          }),
          (n.ɵmod = Qt({ type: n })),
          (n.ɵinj = Pt({ imports: [Dh] })),
          n
        );
      })();
      function l2(n) {
        return "guarded";
      }
      function u2(n) {
        return [
          "disabled" === n.initialNavigation
            ? li(3, [
                {
                  provide: Tl,
                  multi: !0,
                  useFactory: () => {
                    const e = oe(ut);
                    return () => {
                      e.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Nh, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === n.initialNavigation
            ? li(2, [
                { provide: Nh, useValue: 0 },
                {
                  provide: Tl,
                  multi: !0,
                  deps: [Jt],
                  useFactory: (e) => {
                    const t = e.get(oN, Promise.resolve());
                    return () =>
                      t.then(
                        () =>
                          new Promise((i) => {
                            const o = e.get(ut),
                              s = e.get(Wb);
                            (function r(i) {
                              e.get(ut)
                                .events.pipe(
                                  cr(
                                    (s) =>
                                      s instanceof ai ||
                                      s instanceof iu ||
                                      s instanceof cb
                                  ),
                                  re(
                                    (s) =>
                                      s instanceof ai ||
                                      (s instanceof iu &&
                                        (0 === s.code || 1 === s.code) &&
                                        null)
                                  ),
                                  cr((s) => null !== s),
                                  ws(1)
                                )
                                .subscribe(() => {
                                  i();
                                });
                            })(() => {
                              i(!0);
                            }),
                              (e.get(pu).afterPreactivation = () => (
                                i(!0), s.closed ? H(void 0) : s
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const Xb = new V("");
      class mu {}
      class Fh {}
      class fr {
        constructor(e) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            e
              ? (this.lazyInit =
                  "string" == typeof e
                    ? () => {
                        (this.headers = new Map()),
                          e.split("\n").forEach((t) => {
                            const r = t.indexOf(":");
                            if (r > 0) {
                              const i = t.slice(0, r),
                                o = i.toLowerCase(),
                                s = t.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, o),
                                this.headers.has(o)
                                  ? this.headers.get(o).push(s)
                                  : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(e).forEach((t) => {
                            let r = e[t];
                            const i = t.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(i, r),
                                this.maybeSetNormalizedName(t, i));
                          });
                      })
              : (this.headers = new Map());
        }
        has(e) {
          return this.init(), this.headers.has(e.toLowerCase());
        }
        get(e) {
          this.init();
          const t = this.headers.get(e.toLowerCase());
          return t && t.length > 0 ? t[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(e) {
          return this.init(), this.headers.get(e.toLowerCase()) || null;
        }
        append(e, t) {
          return this.clone({ name: e, value: t, op: "a" });
        }
        set(e, t) {
          return this.clone({ name: e, value: t, op: "s" });
        }
        delete(e, t) {
          return this.clone({ name: e, value: t, op: "d" });
        }
        maybeSetNormalizedName(e, t) {
          this.normalizedNames.has(t) || this.normalizedNames.set(t, e);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof fr
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
              (this.lazyUpdate = null)));
        }
        copyFrom(e) {
          e.init(),
            Array.from(e.headers.keys()).forEach((t) => {
              this.headers.set(t, e.headers.get(t)),
                this.normalizedNames.set(t, e.normalizedNames.get(t));
            });
        }
        clone(e) {
          const t = new fr();
          return (
            (t.lazyInit =
              this.lazyInit && this.lazyInit instanceof fr
                ? this.lazyInit
                : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([e])),
            t
          );
        }
        applyUpdate(e) {
          const t = e.name.toLowerCase();
          switch (e.op) {
            case "a":
            case "s":
              let r = e.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(e.name, t);
              const i = ("a" === e.op ? this.headers.get(t) : void 0) || [];
              i.push(...r), this.headers.set(t, i);
              break;
            case "d":
              const o = e.value;
              if (o) {
                let s = this.headers.get(t);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(t), this.normalizedNames.delete(t))
                    : this.headers.set(t, s);
              } else this.headers.delete(t), this.normalizedNames.delete(t);
          }
        }
        forEach(e) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((t) =>
              e(this.normalizedNames.get(t), this.headers.get(t))
            );
        }
      }
      class d2 {
        encodeKey(e) {
          return Zb(e);
        }
        encodeValue(e) {
          return Zb(e);
        }
        decodeKey(e) {
          return decodeURIComponent(e);
        }
        decodeValue(e) {
          return decodeURIComponent(e);
        }
      }
      const h2 = /%(\d[a-f0-9])/gi,
        p2 = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function Zb(n) {
        return encodeURIComponent(n).replace(h2, (e, t) => p2[t] ?? e);
      }
      function _u(n) {
        return `${n}`;
      }
      class xr {
        constructor(e = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = e.encoder || new d2()),
            e.fromString)
          ) {
            if (e.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function f2(n, e) {
              const t = new Map();
              return (
                n.length > 0 &&
                  n
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o
                            ? [e.decodeKey(i), ""]
                            : [
                                e.decodeKey(i.slice(0, o)),
                                e.decodeValue(i.slice(o + 1)),
                              ],
                        l = t.get(s) || [];
                      l.push(a), t.set(s, l);
                    }),
                t
              );
            })(e.fromString, this.encoder);
          } else
            e.fromObject
              ? ((this.map = new Map()),
                Object.keys(e.fromObject).forEach((t) => {
                  const r = e.fromObject[t],
                    i = Array.isArray(r) ? r.map(_u) : [_u(r)];
                  this.map.set(t, i);
                }))
              : (this.map = null);
        }
        has(e) {
          return this.init(), this.map.has(e);
        }
        get(e) {
          this.init();
          const t = this.map.get(e);
          return t ? t[0] : null;
        }
        getAll(e) {
          return this.init(), this.map.get(e) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(e, t) {
          return this.clone({ param: e, value: t, op: "a" });
        }
        appendAll(e) {
          const t = [];
          return (
            Object.keys(e).forEach((r) => {
              const i = e[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    t.push({ param: r, value: o, op: "a" });
                  })
                : t.push({ param: r, value: i, op: "a" });
            }),
            this.clone(t)
          );
        }
        set(e, t) {
          return this.clone({ param: e, value: t, op: "s" });
        }
        delete(e, t) {
          return this.clone({ param: e, value: t, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((e) => {
                const t = this.encoder.encodeKey(e);
                return this.map
                  .get(e)
                  .map((r) => t + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((e) => "" !== e)
              .join("&")
          );
        }
        clone(e) {
          const t = new xr({ encoder: this.encoder });
          return (
            (t.cloneFrom = this.cloneFrom || this),
            (t.updates = (this.updates || []).concat(e)),
            t
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
              this.updates.forEach((e) => {
                switch (e.op) {
                  case "a":
                  case "s":
                    const t =
                      ("a" === e.op ? this.map.get(e.param) : void 0) || [];
                    t.push(_u(e.value)), this.map.set(e.param, t);
                    break;
                  case "d":
                    if (void 0 === e.value) {
                      this.map.delete(e.param);
                      break;
                    }
                    {
                      let r = this.map.get(e.param) || [];
                      const i = r.indexOf(_u(e.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(e.param, r)
                          : this.map.delete(e.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class g2 {
        constructor() {
          this.map = new Map();
        }
        set(e, t) {
          return this.map.set(e, t), this;
        }
        get(e) {
          return (
            this.map.has(e) || this.map.set(e, e.defaultValue()),
            this.map.get(e)
          );
        }
        delete(e) {
          return this.map.delete(e), this;
        }
        has(e) {
          return this.map.has(e);
        }
        keys() {
          return this.map.keys();
        }
      }
      function Jb(n) {
        return typeof ArrayBuffer < "u" && n instanceof ArrayBuffer;
      }
      function eE(n) {
        return typeof Blob < "u" && n instanceof Blob;
      }
      function tE(n) {
        return typeof FormData < "u" && n instanceof FormData;
      }
      class Us {
        constructor(e, t, r, i) {
          let o;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = e.toUpperCase()),
            (function m2(n) {
              switch (n) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new fr()),
            this.context || (this.context = new g2()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = t;
            else {
              const a = t.indexOf("?");
              this.urlWithParams =
                t + (-1 === a ? "?" : a < t.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new xr()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : Jb(this.body) ||
              eE(this.body) ||
              tE(this.body) ||
              (function _2(n) {
                return (
                  typeof URLSearchParams < "u" && n instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof xr
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || tE(this.body)
            ? null
            : eE(this.body)
            ? this.body.type || null
            : Jb(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof xr
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(e = {}) {
          const t = e.method || this.method,
            r = e.url || this.url,
            i = e.responseType || this.responseType,
            o = void 0 !== e.body ? e.body : this.body,
            s =
              void 0 !== e.withCredentials
                ? e.withCredentials
                : this.withCredentials,
            a =
              void 0 !== e.reportProgress
                ? e.reportProgress
                : this.reportProgress;
          let l = e.headers || this.headers,
            u = e.params || this.params;
          const c = e.context ?? this.context;
          return (
            void 0 !== e.setHeaders &&
              (l = Object.keys(e.setHeaders).reduce(
                (d, p) => d.set(p, e.setHeaders[p]),
                l
              )),
            e.setParams &&
              (u = Object.keys(e.setParams).reduce(
                (d, p) => d.set(p, e.setParams[p]),
                u
              )),
            new Us(t, r, o, {
              params: u,
              headers: l,
              context: c,
              reportProgress: a,
              responseType: i,
              withCredentials: s,
            })
          );
        }
      }
      var Qe = (() => (
        ((Qe = Qe || {})[(Qe.Sent = 0)] = "Sent"),
        (Qe[(Qe.UploadProgress = 1)] = "UploadProgress"),
        (Qe[(Qe.ResponseHeader = 2)] = "ResponseHeader"),
        (Qe[(Qe.DownloadProgress = 3)] = "DownloadProgress"),
        (Qe[(Qe.Response = 4)] = "Response"),
        (Qe[(Qe.User = 5)] = "User"),
        Qe
      ))();
      class Ph {
        constructor(e, t = 200, r = "OK") {
          (this.headers = e.headers || new fr()),
            (this.status = void 0 !== e.status ? e.status : t),
            (this.statusText = e.statusText || r),
            (this.url = e.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class kh extends Ph {
        constructor(e = {}) {
          super(e), (this.type = Qe.ResponseHeader);
        }
        clone(e = {}) {
          return new kh({
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class yu extends Ph {
        constructor(e = {}) {
          super(e),
            (this.type = Qe.Response),
            (this.body = void 0 !== e.body ? e.body : null);
        }
        clone(e = {}) {
          return new yu({
            body: void 0 !== e.body ? e.body : this.body,
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class nE extends Ph {
        constructor(e) {
          super(e, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${e.url || "(unknown url)"}`
                : `Http failure response for ${e.url || "(unknown url)"}: ${
                    e.status
                  } ${e.statusText}`),
            (this.error = e.error || null);
        }
      }
      function Oh(n, e) {
        return {
          body: e,
          headers: n.headers,
          context: n.context,
          observe: n.observe,
          params: n.params,
          reportProgress: n.reportProgress,
          responseType: n.responseType,
          withCredentials: n.withCredentials,
        };
      }
      let go = (() => {
        class n {
          constructor(t) {
            this.handler = t;
          }
          request(t, r, i = {}) {
            let o;
            if (t instanceof Us) o = t;
            else {
              let l, u;
              (l = i.headers instanceof fr ? i.headers : new fr(i.headers)),
                i.params &&
                  (u =
                    i.params instanceof xr
                      ? i.params
                      : new xr({ fromObject: i.params })),
                (o = new Us(t, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: u,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = H(o).pipe(Ir((l) => this.handler.handle(l)));
            if (t instanceof Us || "events" === i.observe) return s;
            const a = s.pipe(cr((l) => l instanceof yu));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      re((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      re((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      re((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(re((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`
                );
            }
          }
          delete(t, r = {}) {
            return this.request("DELETE", t, r);
          }
          get(t, r = {}) {
            return this.request("GET", t, r);
          }
          head(t, r = {}) {
            return this.request("HEAD", t, r);
          }
          jsonp(t, r) {
            return this.request("JSONP", t, {
              params: new xr().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(t, r = {}) {
            return this.request("OPTIONS", t, r);
          }
          patch(t, r, i = {}) {
            return this.request("PATCH", t, Oh(i, r));
          }
          post(t, r, i = {}) {
            return this.request("POST", t, Oh(i, r));
          }
          put(t, r, i = {}) {
            return this.request("PUT", t, Oh(i, r));
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(mu));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function rE(n, e) {
        return e(n);
      }
      function y2(n, e) {
        return (t, r) => e.intercept(t, { handle: (i) => n(i, r) });
      }
      const iE = new V("HTTP_INTERCEPTORS"),
        Bs = new V("HTTP_INTERCEPTOR_FNS");
      function C2() {
        let n = null;
        return (e, t) => (
          null === n &&
            (n = (oe(iE, { optional: !0 }) ?? []).reduceRight(y2, rE)),
          n(e, t)
        );
      }
      let oE = (() => {
        class n extends mu {
          constructor(t, r) {
            super(),
              (this.backend = t),
              (this.injector = r),
              (this.chain = null);
          }
          handle(t) {
            if (null === this.chain) {
              const r = Array.from(new Set(this.injector.get(Bs)));
              this.chain = r.reduceRight(
                (i, o) =>
                  (function v2(n, e, t) {
                    return (r, i) => t.runInContext(() => e(r, (o) => n(o, i)));
                  })(i, o, this.injector),
                rE
              );
            }
            return this.chain(t, (r) => this.backend.handle(r));
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(Fh), N(Nn));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const w2 = /^\)\]\}',?\n/;
      let aE = (() => {
        class n {
          constructor(t) {
            this.xhrFactory = t;
          }
          handle(t) {
            if ("JSONP" === t.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new Ue((r) => {
              const i = this.xhrFactory.build();
              if (
                (i.open(t.method, t.urlWithParams),
                t.withCredentials && (i.withCredentials = !0),
                t.headers.forEach((g, m) => i.setRequestHeader(g, m.join(","))),
                t.headers.has("Accept") ||
                  i.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !t.headers.has("Content-Type"))
              ) {
                const g = t.detectContentTypeHeader();
                null !== g && i.setRequestHeader("Content-Type", g);
              }
              if (t.responseType) {
                const g = t.responseType.toLowerCase();
                i.responseType = "json" !== g ? g : "text";
              }
              const o = t.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const g = i.statusText || "OK",
                    m = new fr(i.getAllResponseHeaders()),
                    C =
                      (function S2(n) {
                        return "responseURL" in n && n.responseURL
                          ? n.responseURL
                          : /^X-Request-URL:/m.test(n.getAllResponseHeaders())
                          ? n.getResponseHeader("X-Request-URL")
                          : null;
                      })(i) || t.url;
                  return (
                    (s = new kh({
                      headers: m,
                      status: i.status,
                      statusText: g,
                      url: C,
                    })),
                    s
                  );
                },
                l = () => {
                  let { headers: g, status: m, statusText: C, url: E } = a(),
                    w = null;
                  204 !== m &&
                    (w = typeof i.response > "u" ? i.responseText : i.response),
                    0 === m && (m = w ? 200 : 0);
                  let R = m >= 200 && m < 300;
                  if ("json" === t.responseType && "string" == typeof w) {
                    const S = w;
                    w = w.replace(w2, "");
                    try {
                      w = "" !== w ? JSON.parse(w) : null;
                    } catch (P) {
                      (w = S), R && ((R = !1), (w = { error: P, text: w }));
                    }
                  }
                  R
                    ? (r.next(
                        new yu({
                          body: w,
                          headers: g,
                          status: m,
                          statusText: C,
                          url: E || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new nE({
                          error: w,
                          headers: g,
                          status: m,
                          statusText: C,
                          url: E || void 0,
                        })
                      );
                },
                u = (g) => {
                  const { url: m } = a(),
                    C = new nE({
                      error: g,
                      status: i.status || 0,
                      statusText: i.statusText || "Unknown Error",
                      url: m || void 0,
                    });
                  r.error(C);
                };
              let c = !1;
              const d = (g) => {
                  c || (r.next(a()), (c = !0));
                  let m = { type: Qe.DownloadProgress, loaded: g.loaded };
                  g.lengthComputable && (m.total = g.total),
                    "text" === t.responseType &&
                      i.responseText &&
                      (m.partialText = i.responseText),
                    r.next(m);
                },
                p = (g) => {
                  let m = { type: Qe.UploadProgress, loaded: g.loaded };
                  g.lengthComputable && (m.total = g.total), r.next(m);
                };
              return (
                i.addEventListener("load", l),
                i.addEventListener("error", u),
                i.addEventListener("timeout", u),
                i.addEventListener("abort", u),
                t.reportProgress &&
                  (i.addEventListener("progress", d),
                  null !== o &&
                    i.upload &&
                    i.upload.addEventListener("progress", p)),
                i.send(o),
                r.next({ type: Qe.Sent }),
                () => {
                  i.removeEventListener("error", u),
                    i.removeEventListener("abort", u),
                    i.removeEventListener("load", l),
                    i.removeEventListener("timeout", u),
                    t.reportProgress &&
                      (i.removeEventListener("progress", d),
                      null !== o &&
                        i.upload &&
                        i.upload.removeEventListener("progress", p)),
                    i.readyState !== i.DONE && i.abort();
                }
              );
            });
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(dD));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const Lh = new V("XSRF_ENABLED"),
        lE = "XSRF-TOKEN",
        uE = new V("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => lE,
        }),
        cE = "X-XSRF-TOKEN",
        dE = new V("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => cE,
        });
      class fE {}
      let M2 = (() => {
        class n {
          constructor(t, r, i) {
            (this.doc = t),
              (this.platform = r),
              (this.cookieName = i),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const t = this.doc.cookie || "";
            return (
              t !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = tD(t, this.cookieName)),
                (this.lastCookieString = t)),
              this.lastToken
            );
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(at), N(_f), N(uE));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function T2(n, e) {
        const t = n.url.toLowerCase();
        if (
          !oe(Lh) ||
          "GET" === n.method ||
          "HEAD" === n.method ||
          t.startsWith("http://") ||
          t.startsWith("https://")
        )
          return e(n);
        const r = oe(fE).getToken(),
          i = oe(dE);
        return (
          null != r &&
            !n.headers.has(i) &&
            (n = n.clone({ headers: n.headers.set(i, r) })),
          e(n)
        );
      }
      var Ge = (() => (
        ((Ge = Ge || {})[(Ge.Interceptors = 0)] = "Interceptors"),
        (Ge[(Ge.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (Ge[(Ge.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (Ge[(Ge.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (Ge[(Ge.JsonpSupport = 4)] = "JsonpSupport"),
        (Ge[(Ge.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        Ge
      ))();
      function mo(n, e) {
        return { ɵkind: n, ɵproviders: e };
      }
      function I2(...n) {
        const e = [
          go,
          aE,
          oE,
          { provide: mu, useExisting: oE },
          { provide: Fh, useExisting: aE },
          { provide: Bs, useValue: T2, multi: !0 },
          { provide: Lh, useValue: !0 },
          { provide: fE, useClass: M2 },
        ];
        for (const t of n) e.push(...t.ɵproviders);
        return (function DM(n) {
          return { ɵproviders: n };
        })(e);
      }
      const hE = new V("LEGACY_INTERCEPTOR_FN");
      function x2({ cookieName: n, headerName: e }) {
        const t = [];
        return (
          void 0 !== n && t.push({ provide: uE, useValue: n }),
          void 0 !== e && t.push({ provide: dE, useValue: e }),
          mo(Ge.CustomXsrfConfiguration, t)
        );
      }
      let R2 = (() => {
        class n {}
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵmod = Qt({ type: n })),
          (n.ɵinj = Pt({
            providers: [
              I2(
                mo(Ge.LegacyInterceptors, [
                  { provide: hE, useFactory: C2 },
                  { provide: Bs, useExisting: hE, multi: !0 },
                ]),
                x2({ cookieName: lE, headerName: cE })
              ),
            ],
          })),
          n
        );
      })();
      class mt {
        constructor(e) {
          (this.http = e),
            (this.DATA = new Nt()),
            (this.DATA$ = this.DATA.asObservable()),
            (this.isRefreshTokenCalled = !1);
        }
        setDATA(e) {
          this.DATA.next(e);
        }
        login(e, t) {
          return this.http
            .post(`${ze}/auth`, { username: e, password: t })
            .pipe(Ce((r) => Ie(() => r)));
        }
        getToken() {
          return sessionStorage.getItem("Token") || "";
        }
        haveAccess() {
          let t,
            e = sessionStorage.getItem("Token") || "";
          if ("" !== e) {
            let r = e.split(".")[1],
              i = atob(r);
            t = JSON.parse(i);
          } else t = { UserInfo: { roles: [] } };
          return t;
        }
        setIsRefreshToken(e) {
          this.isRefreshTokenCalled = e;
        }
        refreshToken() {
          return new Promise((e, t) => {
            this.http.get(`${ze}/refresh`, { withCredentials: !0 }).subscribe({
              next: (r) => {
                let i = r.accessToken;
                sessionStorage.setItem("Token", r.accessToken),
                  (this.isRefreshTokenCalled = !1),
                  e(i);
              },
              error: (r) => {
                t(r);
              },
            });
          });
        }
        logOut() {
          return this.http.get(`${ze}/logout`);
        }
      }
      (mt.ɵfac = function (e) {
        return new (e || mt)(N(go));
      }),
        (mt.ɵprov = O({ token: mt, factory: mt.ɵfac, providedIn: "root" }));
      const ze = "https://moonlight-znjk.onrender.com";
      class Mn {
        constructor(e, t) {
          (this._loginService = e), (this.router = t);
        }
        canActivate(e, t) {
          return (
            !!this._loginService
              .haveAccess()
              .UserInfo.roles.includes(e.data.role) ||
            (this.router.navigate(["/home"]), !1)
          );
        }
      }
      (Mn.ɵfac = function (e) {
        return new (e || Mn)(N(mt), N(ut));
      }),
        (Mn.ɵprov = O({ token: Mn, factory: Mn.ɵfac, providedIn: "root" }));
      class vu {
        constructor() {
          (this.title = ""), (this.date = "");
        }
      }
      class jn {
        constructor(e) {
          (this.http = e),
            (this.REFRESH = new Nt()),
            (this.REFRESH$ = this.REFRESH.asObservable());
        }
        setREFRESH(e) {
          this.REFRESH.next(e);
        }
        getAllExpences() {
          return this.http.get(`${ze}/expences`).pipe(Ce((e) => Ie(() => e)));
        }
        addNewExpence(e) {
          return this.http
            .post(`${ze}/expences`, e)
            .pipe(Ce((t) => Ie(() => t)));
        }
        editExpence(e, t) {
          return this.http
            .patch(`${ze}/expences/${e}`, t)
            .pipe(Ce((r) => Ie(() => r)));
        }
        deleteExpence(e) {
          return this.http
            .delete(`${ze}/expences/${e}`)
            .pipe(Ce((t) => Ie(() => t)));
        }
      }
      function N2(n, e) {
        1 & n && B(0, "div");
      }
      function F2(n, e) {}
      function P2(n, e) {
        1 & n && B(0, "div");
      }
      function k2(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 9),
            x("click", function () {
              $(t);
              const i = D(3).$implicit,
                o = D().$implicit,
                s = D();
              return U(s.sendData(7 * o + i - s.firstDay + 1, s.month));
            }),
            _(1),
            f();
        }
        if (2 & n) {
          const t = D(3).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function O2(n, e) {
        if ((1 & n && (h(0, "button", 10), _(1), f()), 2 & n)) {
          const t = D(3).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function L2(n, e) {
        if (
          (1 & n &&
            (h(0, "div"),
            b(1, P2, 1, 0, "div", 3),
            b(2, k2, 2, 1, "ng-template", null, 7, W),
            b(4, O2, 2, 1, "ng-template", null, 8, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D(2).$implicit,
            o = D().$implicit,
            s = D();
          y(1),
            v(
              "ngIf",
              s.findReservation(
                s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
              )
            )("ngIfThen", t)("ngIfElse", r);
        }
      }
      function V2(n, e) {
        if ((1 & n && b(0, L2, 6, 3, "div", 6), 2 & n)) {
          const t = D().$implicit,
            r = D().$implicit,
            i = D();
          v("ngIf", 7 * r + t - i.firstDay + 1 <= i.daysInMonth);
        }
      }
      function $2(n, e) {
        if (
          (1 & n &&
            (h(0, "td"),
            b(1, N2, 1, 0, "div", 3),
            b(2, F2, 0, 0, "ng-template", null, 4, W),
            b(4, V2, 1, 1, "ng-template", null, 5, W),
            f()),
          2 & n)
        ) {
          const t = e.$implicit,
            r = I(3),
            i = I(5),
            o = D().$implicit,
            s = D();
          y(1),
            v("ngIf", 0 === o && t < s.firstDay)("ngIfThen", r)("ngIfElse", i);
        }
      }
      function U2(n, e) {
        if ((1 & n && (h(0, "tr"), b(1, $2, 6, 3, "td", 2), f()), 2 & n)) {
          const t = D();
          y(1), v("ngForOf", t.jArr);
        }
      }
      (jn.ɵfac = function (e) {
        return new (e || jn)(N(go));
      }),
        (jn.ɵprov = O({ token: jn, factory: jn.ɵfac, providedIn: "root" }));
      class js {
        constructor() {
          (this.sendDate = new he()),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.EXPENCES = []),
            (this.iArr = [0, 1, 2, 3, 4, 5]),
            (this.jArr = [0, 1, 2, 3, 4, 5, 6]);
        }
        findReservation(e) {
          return !!this.EXPENCES.filter((r) => r.date == e)[0];
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
        sendData(e, t) {
          this.sendDate.emit({ day: e, month: t });
        }
      }
      (js.ɵfac = function (e) {
        return new (e || js)();
      }),
        (js.ɵcmp = Ae({
          type: js,
          selectors: [["app-expences-calendar"]],
          inputs: {
            month: "month",
            year: "year",
            firstDay: "firstDay",
            daysInMonth: "daysInMonth",
            EXPENCES: "EXPENCES",
          },
          outputs: { sendDate: "sendDate" },
          decls: 19,
          vars: 1,
          consts: [
            [1, "w-100", "p-1", "text-bg-dark"],
            [
              1,
              "text-center",
              "text-bg-secondary",
              "py-2",
              "w-auto",
              "border",
              "border-3",
              "border-dark",
              "rounded",
            ],
            [4, "ngFor", "ngForOf"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [4, "ngIf"],
            ["thenblock10", ""],
            ["elseblock10", ""],
            [1, "btn", "btn-success", "w-100", 3, "click"],
            ["disabled", "", 1, "btn", "btn-outline-secondary", "w-100"],
          ],
          template: function (e, t) {
            1 & e &&
              (h(0, "table", 0)(1, "thead")(2, "tr")(3, "th", 1),
              _(4, " Sun "),
              f(),
              h(5, "th", 1),
              _(6, " Mon "),
              f(),
              h(7, "th", 1),
              _(8, " Tue "),
              f(),
              h(9, "th", 1),
              _(10, " Wed "),
              f(),
              h(11, "th", 1),
              _(12, " Thu "),
              f(),
              h(13, "th", 1),
              _(14, " Fri "),
              f(),
              h(15, "th", 1),
              _(16, " Sat "),
              f()()(),
              h(17, "tbody"),
              b(18, U2, 2, 1, "tr", 2),
              f()()),
              2 & e && (y(18), v("ngForOf", t.iArr));
          },
          dependencies: [$n, $e],
        }));
      let pE = (() => {
          class n {
            constructor(t, r) {
              (this._renderer = t),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(t, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, r);
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            setDisabledState(t) {
              this.setProperty("disabled", t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(nr), M(Ut));
            }),
            (n.ɵdir = Y({ type: n })),
            n
          );
        })(),
        ui = (() => {
          class n extends pE {}
          return (
            (n.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = st(n)))(r || n);
              };
            })()),
            (n.ɵdir = Y({ type: n, features: [ve] })),
            n
          );
        })();
      const Hn = new V("NgValueAccessor"),
        j2 = { provide: Hn, useExisting: Se(() => Cu), multi: !0 };
      let Cu = (() => {
        class n extends ui {
          writeValue(t) {
            this.setProperty("checked", t);
          }
        }
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              ["input", "type", "checkbox", "formControlName", ""],
              ["input", "type", "checkbox", "formControl", ""],
              ["input", "type", "checkbox", "ngModel", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                x("change", function (o) {
                  return r.onChange(o.target.checked);
                })("blur", function () {
                  return r.onTouched();
                });
            },
            features: [Re([j2]), ve],
          })),
          n
        );
      })();
      const H2 = { provide: Hn, useExisting: Se(() => on), multi: !0 },
        z2 = new V("CompositionEventMode");
      let on = (() => {
        class n extends pE {
          constructor(t, r, i) {
            super(t, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function G2() {
                  const n = Vn() ? Vn().getUserAgent() : "";
                  return /android (\d+)/.test(n.toLowerCase());
                })());
          }
          writeValue(t) {
            this.setProperty("value", t ?? "");
          }
          _handleInput(t) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(t);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(t) {
            (this._composing = !1), this._compositionMode && this.onChange(t);
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(M(nr), M(Ut), M(z2, 8));
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                x("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [Re([H2]), ve],
          })),
          n
        );
      })();
      function Rr(n) {
        return (
          null == n ||
          (("string" == typeof n || Array.isArray(n)) && 0 === n.length)
        );
      }
      function gE(n) {
        return null != n && "number" == typeof n.length;
      }
      const _t = new V("NgValidators"),
        Nr = new V("NgAsyncValidators");
      function yE(n) {
        return Rr(n.value) ? { required: !0 } : null;
      }
      function Du(n) {
        return null;
      }
      function wE(n) {
        return null != n;
      }
      function SE(n) {
        return ss(n) ? Be(n) : n;
      }
      function ME(n) {
        let e = {};
        return (
          n.forEach((t) => {
            e = null != t ? { ...e, ...t } : e;
          }),
          0 === Object.keys(e).length ? null : e
        );
      }
      function TE(n, e) {
        return e.map((t) => t(n));
      }
      function IE(n) {
        return n.map((e) =>
          (function K2(n) {
            return !n.validate;
          })(e)
            ? e
            : (t) => e.validate(t)
        );
      }
      function Vh(n) {
        return null != n
          ? (function AE(n) {
              if (!n) return null;
              const e = n.filter(wE);
              return 0 == e.length
                ? null
                : function (t) {
                    return ME(TE(t, e));
                  };
            })(IE(n))
          : null;
      }
      function $h(n) {
        return null != n
          ? (function xE(n) {
              if (!n) return null;
              const e = n.filter(wE);
              return 0 == e.length
                ? null
                : function (t) {
                    return (function B2(...n) {
                      const e = Zp(n),
                        { args: t, keys: r } = OD(n),
                        i = new Ue((o) => {
                          const { length: s } = t;
                          if (!s) return void o.complete();
                          const a = new Array(s);
                          let l = s,
                            u = s;
                          for (let c = 0; c < s; c++) {
                            let d = !1;
                            dn(t[c]).subscribe(
                              Ye(
                                o,
                                (p) => {
                                  d || ((d = !0), u--), (a[c] = p);
                                },
                                () => l--,
                                void 0,
                                () => {
                                  (!l || !d) &&
                                    (u || o.next(r ? VD(r, a) : a),
                                    o.complete());
                                }
                              )
                            );
                          }
                        });
                      return e ? i.pipe(LD(e)) : i;
                    })(TE(t, e).map(SE)).pipe(re(ME));
                  };
            })(IE(n))
          : null;
      }
      function RE(n, e) {
        return null === n ? [e] : Array.isArray(n) ? [...n, e] : [n, e];
      }
      function Uh(n) {
        return n ? (Array.isArray(n) ? n : [n]) : [];
      }
      function bu(n, e) {
        return Array.isArray(n) ? n.includes(e) : n === e;
      }
      function PE(n, e) {
        const t = Uh(e);
        return (
          Uh(n).forEach((i) => {
            bu(t, i) || t.push(i);
          }),
          t
        );
      }
      function kE(n, e) {
        return Uh(e).filter((t) => !bu(n, t));
      }
      class OE {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(e) {
          (this._rawValidators = e || []),
            (this._composedValidatorFn = Vh(this._rawValidators));
        }
        _setAsyncValidators(e) {
          (this._rawAsyncValidators = e || []),
            (this._composedAsyncValidatorFn = $h(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(e) {
          this._onDestroyCallbacks.push(e);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((e) => e()),
            (this._onDestroyCallbacks = []);
        }
        reset(e) {
          this.control && this.control.reset(e);
        }
        hasError(e, t) {
          return !!this.control && this.control.hasError(e, t);
        }
        getError(e, t) {
          return this.control ? this.control.getError(e, t) : null;
        }
      }
      class Mt extends OE {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Fr extends OE {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class LE {
        constructor(e) {
          this._cd = e;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let jt = (() => {
          class n extends LE {
            constructor(t) {
              super(t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(Fr, 2));
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (t, r) {
                2 & t &&
                  be("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [ve],
            })),
            n
          );
        })(),
        Gn = (() => {
          class n extends LE {
            constructor(t) {
              super(t);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(Mt, 10));
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (t, r) {
                2 & t &&
                  be("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [ve],
            })),
            n
          );
        })();
      const Hs = "VALID",
        wu = "INVALID",
        _o = "PENDING",
        Gs = "DISABLED";
      function Gh(n) {
        return (Su(n) ? n.validators : n) || null;
      }
      function zh(n, e) {
        return (Su(e) ? e.asyncValidators : n) || null;
      }
      function Su(n) {
        return null != n && !Array.isArray(n) && "object" == typeof n;
      }
      class BE {
        constructor(e, t) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(e),
            this._assignAsyncValidators(t);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(e) {
          this._rawValidators = this._composedValidatorFn = e;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(e) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Hs;
        }
        get invalid() {
          return this.status === wu;
        }
        get pending() {
          return this.status == _o;
        }
        get disabled() {
          return this.status === Gs;
        }
        get enabled() {
          return this.status !== Gs;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(e) {
          this._assignValidators(e);
        }
        setAsyncValidators(e) {
          this._assignAsyncValidators(e);
        }
        addValidators(e) {
          this.setValidators(PE(e, this._rawValidators));
        }
        addAsyncValidators(e) {
          this.setAsyncValidators(PE(e, this._rawAsyncValidators));
        }
        removeValidators(e) {
          this.setValidators(kE(e, this._rawValidators));
        }
        removeAsyncValidators(e) {
          this.setAsyncValidators(kE(e, this._rawAsyncValidators));
        }
        hasValidator(e) {
          return bu(this._rawValidators, e);
        }
        hasAsyncValidator(e) {
          return bu(this._rawAsyncValidators, e);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(e = {}) {
          (this.touched = !0),
            this._parent && !e.onlySelf && this._parent.markAsTouched(e);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((e) => e.markAllAsTouched());
        }
        markAsUntouched(e = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((t) => {
              t.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        markAsDirty(e = {}) {
          (this.pristine = !1),
            this._parent && !e.onlySelf && this._parent.markAsDirty(e);
        }
        markAsPristine(e = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((t) => {
              t.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        markAsPending(e = {}) {
          (this.status = _o),
            !1 !== e.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !e.onlySelf && this._parent.markAsPending(e);
        }
        disable(e = {}) {
          const t = this._parentMarkedDirty(e.onlySelf);
          (this.status = Gs),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...e, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...e, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(e = {}) {
          const t = this._parentMarkedDirty(e.onlySelf);
          (this.status = Hs),
            this._forEachChild((r) => {
              r.enable({ ...e, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            }),
            this._updateAncestors({ ...e, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(e) {
          this._parent &&
            !e.onlySelf &&
            (this._parent.updateValueAndValidity(e),
            e.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(e) {
          this._parent = e;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(e = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Hs || this.status === _o) &&
                this._runAsyncValidator(e.emitEvent)),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !e.onlySelf &&
              this._parent.updateValueAndValidity(e);
        }
        _updateTreeValidity(e = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(e)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Gs : Hs;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(e) {
          if (this.asyncValidator) {
            (this.status = _o), (this._hasOwnPendingAsyncValidator = !0);
            const t = SE(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: e });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(e, t = {}) {
          (this.errors = e), this._updateControlsErrors(!1 !== t.emitEvent);
        }
        get(e) {
          let t = e;
          return null == t ||
            (Array.isArray(t) || (t = t.split(".")), 0 === t.length)
            ? null
            : t.reduce((r, i) => r && r._find(i), this);
        }
        getError(e, t) {
          const r = t ? this.get(t) : this;
          return r && r.errors ? r.errors[e] : null;
        }
        hasError(e, t) {
          return !!this.getError(e, t);
        }
        get root() {
          let e = this;
          for (; e._parent; ) e = e._parent;
          return e;
        }
        _updateControlsErrors(e) {
          (this.status = this._calculateStatus()),
            e && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(e);
        }
        _initObservables() {
          (this.valueChanges = new he()), (this.statusChanges = new he());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Gs
            : this.errors
            ? wu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(_o)
            ? _o
            : this._anyControlsHaveStatus(wu)
            ? wu
            : Hs;
        }
        _anyControlsHaveStatus(e) {
          return this._anyControls((t) => t.status === e);
        }
        _anyControlsDirty() {
          return this._anyControls((e) => e.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((e) => e.touched);
        }
        _updatePristine(e = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        _updateTouched(e = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        _registerOnCollectionChange(e) {
          this._onCollectionChange = e;
        }
        _setUpdateStrategy(e) {
          Su(e) && null != e.updateOn && (this._updateOn = e.updateOn);
        }
        _parentMarkedDirty(e) {
          return (
            !e &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(e) {
          return null;
        }
        _assignValidators(e) {
          (this._rawValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedValidatorFn = (function tL(n) {
              return Array.isArray(n) ? Vh(n) : n || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(e) {
          (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedAsyncValidatorFn = (function nL(n) {
              return Array.isArray(n) ? $h(n) : n || null;
            })(this._rawAsyncValidators));
        }
      }
      class qh extends BE {
        constructor(e, t, r) {
          super(Gh(t), zh(r, t)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(e, t) {
          return this.controls[e]
            ? this.controls[e]
            : ((this.controls[e] = t),
              t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange),
              t);
        }
        addControl(e, t, r = {}) {
          this.registerControl(e, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(e, t = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(e, t, r = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            t && this.registerControl(e, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(e) {
          return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
        }
        setValue(e, t = {}) {
          (function UE(n, e, t) {
            n._forEachChild((r, i) => {
              if (void 0 === t[i]) throw new T(1002, "");
            });
          })(this, 0, e),
            Object.keys(e).forEach((r) => {
              (function $E(n, e, t) {
                const r = n.controls;
                if (!(e ? Object.keys(r) : r).length) throw new T(1e3, "");
                if (!r[t]) throw new T(1001, "");
              })(this, !0, r),
                this.controls[r].setValue(e[r], {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(e, t = {}) {
          null != e &&
            (Object.keys(e).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(e[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(e = {}, t = {}) {
          this._forEachChild((r, i) => {
            r.reset(e[i], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (e, t, r) => ((e[r] = t.getRawValue()), e)
          );
        }
        _syncPendingControls() {
          let e = this._reduceChildren(
            !1,
            (t, r) => !!r._syncPendingControls() || t
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          Object.keys(this.controls).forEach((t) => {
            const r = this.controls[t];
            r && e(r, t);
          });
        }
        _setUpControls() {
          this._forEachChild((e) => {
            e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(e) {
          for (const [t, r] of Object.entries(this.controls))
            if (this.contains(t) && e(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, r, i) => ((r.enabled || this.disabled) && (t[i] = r.value), t)
          );
        }
        _reduceChildren(e, t) {
          let r = e;
          return (
            this._forEachChild((i, o) => {
              r = t(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const e of Object.keys(this.controls))
            if (this.controls[e].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(e) {
          return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
        }
      }
      const zs = new V("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Wh,
        }),
        Wh = "always";
      function Mu(n, e) {
        return [...e.path, n];
      }
      function qs(n, e, t = Wh) {
        Kh(n, e),
          e.valueAccessor.writeValue(n.value),
          (n.disabled || "always" === t) &&
            e.valueAccessor.setDisabledState?.(n.disabled),
          (function oL(n, e) {
            e.valueAccessor.registerOnChange((t) => {
              (n._pendingValue = t),
                (n._pendingChange = !0),
                (n._pendingDirty = !0),
                "change" === n.updateOn && jE(n, e);
            });
          })(n, e),
          (function aL(n, e) {
            const t = (r, i) => {
              e.valueAccessor.writeValue(r), i && e.viewToModelUpdate(r);
            };
            n.registerOnChange(t),
              e._registerOnDestroy(() => {
                n._unregisterOnChange(t);
              });
          })(n, e),
          (function sL(n, e) {
            e.valueAccessor.registerOnTouched(() => {
              (n._pendingTouched = !0),
                "blur" === n.updateOn && n._pendingChange && jE(n, e),
                "submit" !== n.updateOn && n.markAsTouched();
            });
          })(n, e),
          (function iL(n, e) {
            if (e.valueAccessor.setDisabledState) {
              const t = (r) => {
                e.valueAccessor.setDisabledState(r);
              };
              n.registerOnDisabledChange(t),
                e._registerOnDestroy(() => {
                  n._unregisterOnDisabledChange(t);
                });
            }
          })(n, e);
      }
      function Iu(n, e) {
        n.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(e);
        });
      }
      function Kh(n, e) {
        const t = (function NE(n) {
          return n._rawValidators;
        })(n);
        null !== e.validator
          ? n.setValidators(RE(t, e.validator))
          : "function" == typeof t && n.setValidators([t]);
        const r = (function FE(n) {
          return n._rawAsyncValidators;
        })(n);
        null !== e.asyncValidator
          ? n.setAsyncValidators(RE(r, e.asyncValidator))
          : "function" == typeof r && n.setAsyncValidators([r]);
        const i = () => n.updateValueAndValidity();
        Iu(e._rawValidators, i), Iu(e._rawAsyncValidators, i);
      }
      function jE(n, e) {
        n._pendingDirty && n.markAsDirty(),
          n.setValue(n._pendingValue, { emitModelToViewChange: !1 }),
          e.viewToModelUpdate(n._pendingValue),
          (n._pendingChange = !1);
      }
      const fL = { provide: Mt, useExisting: Se(() => sn) },
        Ws = (() => Promise.resolve())();
      let sn = (() => {
        class n extends Mt {
          constructor(t, r, i) {
            super(),
              (this.callSetDisabledState = i),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new he()),
              (this.form = new qh({}, Vh(t), $h(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(t) {
            Ws.then(() => {
              const r = this._findContainer(t.path);
              (t.control = r.registerControl(t.name, t.control)),
                qs(t.control, t, this.callSetDisabledState),
                t.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(t);
            });
          }
          getControl(t) {
            return this.form.get(t.path);
          }
          removeControl(t) {
            Ws.then(() => {
              const r = this._findContainer(t.path);
              r && r.removeControl(t.name), this._directives.delete(t);
            });
          }
          addFormGroup(t) {
            Ws.then(() => {
              const r = this._findContainer(t.path),
                i = new qh({});
              (function HE(n, e) {
                Kh(n, e);
              })(i, t),
                r.registerControl(t.name, i),
                i.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(t) {
            Ws.then(() => {
              const r = this._findContainer(t.path);
              r && r.removeControl(t.name);
            });
          }
          getFormGroup(t) {
            return this.form.get(t.path);
          }
          updateModel(t, r) {
            Ws.then(() => {
              this.form.get(t.path).setValue(r);
            });
          }
          setValue(t) {
            this.control.setValue(t);
          }
          onSubmit(t) {
            return (
              (this.submitted = !0),
              (function GE(n, e) {
                n._syncPendingControls(),
                  e.forEach((t) => {
                    const r = t.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (t.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this._directives),
              this.ngSubmit.emit(t),
              "dialog" === t?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(t) {
            this.form.reset(t), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(t) {
            return t.pop(), t.length ? this.form.get(t) : this.form;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(M(_t, 10), M(Nr, 10), M(zs, 8));
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                x("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Re([fL]), ve],
          })),
          n
        );
      })();
      function zE(n, e) {
        const t = n.indexOf(e);
        t > -1 && n.splice(t, 1);
      }
      function qE(n) {
        return (
          "object" == typeof n &&
          null !== n &&
          2 === Object.keys(n).length &&
          "value" in n &&
          "disabled" in n
        );
      }
      const WE = class extends BE {
        constructor(e = null, t, r) {
          super(Gh(t), zh(r, t)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(e),
            this._setUpdateStrategy(t),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            Su(t) &&
              (t.nonNullable || t.initialValueIsDefault) &&
              (this.defaultValue = qE(e) ? e.value : e);
        }
        setValue(e, t = {}) {
          (this.value = this._pendingValue = e),
            this._onChange.length &&
              !1 !== t.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== t.emitViewToModelChange)
              ),
            this.updateValueAndValidity(t);
        }
        patchValue(e, t = {}) {
          this.setValue(e, t);
        }
        reset(e = this.defaultValue, t = {}) {
          this._applyFormState(e),
            this.markAsPristine(t),
            this.markAsUntouched(t),
            this.setValue(this.value, t),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(e) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(e) {
          this._onChange.push(e);
        }
        _unregisterOnChange(e) {
          zE(this._onChange, e);
        }
        registerOnDisabledChange(e) {
          this._onDisabledChange.push(e);
        }
        _unregisterOnDisabledChange(e) {
          zE(this._onDisabledChange, e);
        }
        _forEachChild(e) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(e) {
          qE(e)
            ? ((this.value = this._pendingValue = e.value),
              e.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = e);
        }
      };
      let KE = (() => {
        class n extends Mt {
          ngOnInit() {
            this._checkParentType(), this.formDirective.addFormGroup(this);
          }
          ngOnDestroy() {
            this.formDirective && this.formDirective.removeFormGroup(this);
          }
          get control() {
            return this.formDirective.getFormGroup(this);
          }
          get path() {
            return Mu(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            );
          }
          get formDirective() {
            return this._parent ? this._parent.formDirective : null;
          }
          _checkParentType() {}
        }
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵdir = Y({ type: n, features: [ve] })),
          n
        );
      })();
      const pL = { provide: Mt, useExisting: Se(() => yo) };
      let yo = (() => {
        class n extends KE {
          constructor(t, r, i) {
            super(),
              (this._parent = t),
              this._setValidators(r),
              this._setAsyncValidators(i);
          }
          _checkParentType() {}
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(M(Mt, 5), M(_t, 10), M(Nr, 10));
          }),
          (n.ɵdir = Y({
            type: n,
            selectors: [["", "ngModelGroup", ""]],
            inputs: { name: ["ngModelGroup", "name"] },
            exportAs: ["ngModelGroup"],
            features: [Re([pL]), ve],
          })),
          n
        );
      })();
      const gL = { provide: Fr, useExisting: Se(() => Rt) },
        QE = (() => Promise.resolve())();
      let Rt = (() => {
          class n extends Fr {
            constructor(t, r, i, o, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new WE()),
                (this._registered = !1),
                (this.update = new he()),
                (this._parent = t),
                this._setValidators(r),
                this._setAsyncValidators(i),
                (this.valueAccessor = (function Xh(n, e) {
                  if (!e) return null;
                  let t, r, i;
                  return (
                    Array.isArray(e),
                    e.forEach((o) => {
                      o.constructor === on
                        ? (t = o)
                        : (function cL(n) {
                            return Object.getPrototypeOf(n.constructor) === ui;
                          })(o)
                        ? (r = o)
                        : (i = o);
                    }),
                    i || r || t || null
                  );
                })(0, o));
            }
            ngOnChanges(t) {
              if ((this._checkForErrors(), !this._registered || "name" in t)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = t.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in t && this._updateDisabled(t),
                (function Yh(n, e) {
                  if (!n.hasOwnProperty("model")) return !1;
                  const t = n.model;
                  return !!t.isFirstChange() || !Object.is(e, t.currentValue);
                })(t, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(t) {
              (this.viewModel = t), this.update.emit(t);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              qs(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(t) {
              QE.then(() => {
                this.control.setValue(t, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(t) {
              const r = t.isDisabled.currentValue,
                i = 0 !== r && no(r);
              QE.then(() => {
                i && !this.control.disabled
                  ? this.control.disable()
                  : !i && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(t) {
              return this._parent ? Mu(t, this._parent) : [t];
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(
                M(Mt, 9),
                M(_t, 10),
                M(Nr, 10),
                M(Hn, 10),
                M(Rl, 8),
                M(zs, 8)
              );
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [Re([gL]), ve, Yt],
            })),
            n
          );
        })(),
        zn = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            n
          );
        })();
      const mL = { provide: Hn, useExisting: Se(() => Pr), multi: !0 };
      let Pr = (() => {
          class n extends ui {
            writeValue(t) {
              this.setProperty("value", t ?? "");
            }
            registerOnChange(t) {
              this.onChange = (r) => {
                t("" == r ? null : parseFloat(r));
              };
            }
          }
          return (
            (n.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = st(n)))(r || n);
              };
            })()),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["input", "type", "number", "formControlName", ""],
                ["input", "type", "number", "formControl", ""],
                ["input", "type", "number", "ngModel", ""],
              ],
              hostBindings: function (t, r) {
                1 & t &&
                  x("input", function (o) {
                    return r.onChange(o.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              features: [Re([mL]), ve],
            })),
            n
          );
        })(),
        YE = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵmod = Qt({ type: n })),
            (n.ɵinj = Pt({})),
            n
          );
        })();
      const SL = { provide: Hn, useExisting: Se(() => vo), multi: !0 };
      function r1(n, e) {
        return null == n
          ? `${e}`
          : (e && "object" == typeof e && (e = "Object"),
            `${n}: ${e}`.slice(0, 50));
      }
      let vo = (() => {
          class n extends ui {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(t) {
              this._compareWith = t;
            }
            writeValue(t) {
              this.value = t;
              const i = r1(this._getOptionId(t), t);
              this.setProperty("value", i);
            }
            registerOnChange(t) {
              this.onChange = (r) => {
                (this.value = this._getOptionValue(r)), t(this.value);
              };
            }
            _registerOption() {
              return (this._idCounter++).toString();
            }
            _getOptionId(t) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r), t)) return r;
              return null;
            }
            _getOptionValue(t) {
              const r = (function ML(n) {
                return n.split(":")[0];
              })(t);
              return this._optionMap.has(r) ? this._optionMap.get(r) : t;
            }
          }
          return (
            (n.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = st(n)))(r || n);
              };
            })()),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (t, r) {
                1 & t &&
                  x("change", function (o) {
                    return r.onChange(o.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Re([SL]), ve],
            })),
            n
          );
        })(),
        xu = (() => {
          class n {
            constructor(t, r, i) {
              (this._element = t),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption());
            }
            set ngValue(t) {
              null != this._select &&
                (this._select._optionMap.set(this.id, t),
                this._setElementValue(r1(this.id, t)),
                this._select.writeValue(this._select.value));
            }
            set value(t) {
              this._setElementValue(t),
                this._select && this._select.writeValue(this._select.value);
            }
            _setElementValue(t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                t
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(Ut), M(nr), M(vo, 9));
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            n
          );
        })();
      const TL = { provide: Hn, useExisting: Se(() => tp), multi: !0 };
      function i1(n, e) {
        return null == n
          ? `${e}`
          : ("string" == typeof e && (e = `'${e}'`),
            e && "object" == typeof e && (e = "Object"),
            `${n}: ${e}`.slice(0, 50));
      }
      let tp = (() => {
          class n extends ui {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(t) {
              this._compareWith = t;
            }
            writeValue(t) {
              let r;
              if (((this.value = t), Array.isArray(t))) {
                const i = t.map((o) => this._getOptionId(o));
                r = (o, s) => {
                  o._setSelected(i.indexOf(s.toString()) > -1);
                };
              } else
                r = (i, o) => {
                  i._setSelected(!1);
                };
              this._optionMap.forEach(r);
            }
            registerOnChange(t) {
              this.onChange = (r) => {
                const i = [],
                  o = r.selectedOptions;
                if (void 0 !== o) {
                  const s = o;
                  for (let a = 0; a < s.length; a++) {
                    const u = this._getOptionValue(s[a].value);
                    i.push(u);
                  }
                } else {
                  const s = r.options;
                  for (let a = 0; a < s.length; a++) {
                    const l = s[a];
                    if (l.selected) {
                      const u = this._getOptionValue(l.value);
                      i.push(u);
                    }
                  }
                }
                (this.value = i), t(i);
              };
            }
            _registerOption(t) {
              const r = (this._idCounter++).toString();
              return this._optionMap.set(r, t), r;
            }
            _getOptionId(t) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r)._value, t))
                  return r;
              return null;
            }
            _getOptionValue(t) {
              const r = (function IL(n) {
                return n.split(":")[0];
              })(t);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : t;
            }
          }
          return (
            (n.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = st(n)))(r || n);
              };
            })()),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (t, r) {
                1 & t &&
                  x("change", function (o) {
                    return r.onChange(o.target);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Re([TL]), ve],
            })),
            n
          );
        })(),
        Ru = (() => {
          class n {
            constructor(t, r, i) {
              (this._element = t),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption(this));
            }
            set ngValue(t) {
              null != this._select &&
                ((this._value = t),
                this._setElementValue(i1(this.id, t)),
                this._select.writeValue(this._select.value));
            }
            set value(t) {
              this._select
                ? ((this._value = t),
                  this._setElementValue(i1(this.id, t)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(t);
            }
            _setElementValue(t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                t
              );
            }
            _setSelected(t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "selected",
                t
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)(M(Ut), M(nr), M(tp, 9));
            }),
            (n.ɵdir = Y({
              type: n,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            n
          );
        })();
      function o1(n) {
        return "number" == typeof n ? n : parseInt(n, 10);
      }
      let ci = (() => {
        class n {
          constructor() {
            this._validator = Du;
          }
          ngOnChanges(t) {
            if (this.inputName in t) {
              const r = this.normalizeInput(t[this.inputName].currentValue);
              (this._enabled = this.enabled(r)),
                (this._validator = this._enabled
                  ? this.createValidator(r)
                  : Du),
                this._onChange && this._onChange();
            }
          }
          validate(t) {
            return this._validator(t);
          }
          registerOnValidatorChange(t) {
            this._onChange = t;
          }
          enabled(t) {
            return null != t;
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵdir = Y({ type: n, features: [Yt] })),
          n
        );
      })();
      const RL = { provide: _t, useExisting: Se(() => an), multi: !0 };
      let an = (() => {
        class n extends ci {
          constructor() {
            super(...arguments),
              (this.inputName = "required"),
              (this.normalizeInput = no),
              (this.createValidator = (t) => yE);
          }
          enabled(t) {
            return t;
          }
        }
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              [
                "",
                "required",
                "",
                "formControlName",
                "",
                3,
                "type",
                "checkbox",
              ],
              ["", "required", "", "formControl", "", 3, "type", "checkbox"],
              ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
            ],
            hostVars: 1,
            hostBindings: function (t, r) {
              2 & t && kn("required", r._enabled ? "" : null);
            },
            inputs: { required: "required" },
            features: [Re([RL]), ve],
          })),
          n
        );
      })();
      const PL = { provide: _t, useExisting: Se(() => Tn), multi: !0 };
      let Tn = (() => {
        class n extends ci {
          constructor() {
            super(...arguments),
              (this.inputName = "minlength"),
              (this.normalizeInput = (t) => o1(t)),
              (this.createValidator = (t) =>
                (function DE(n) {
                  return (e) =>
                    Rr(e.value) || !gE(e.value)
                      ? null
                      : e.value.length < n
                      ? {
                          minlength: {
                            requiredLength: n,
                            actualLength: e.value.length,
                          },
                        }
                      : null;
                })(t));
          }
        }
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              ["", "minlength", "", "formControlName", ""],
              ["", "minlength", "", "formControl", ""],
              ["", "minlength", "", "ngModel", ""],
            ],
            hostVars: 1,
            hostBindings: function (t, r) {
              2 & t && kn("minlength", r._enabled ? r.minlength : null);
            },
            inputs: { minlength: "minlength" },
            features: [Re([PL]), ve],
          })),
          n
        );
      })();
      const kL = { provide: _t, useExisting: Se(() => di), multi: !0 };
      let di = (() => {
        class n extends ci {
          constructor() {
            super(...arguments),
              (this.inputName = "maxlength"),
              (this.normalizeInput = (t) => o1(t)),
              (this.createValidator = (t) =>
                (function bE(n) {
                  return (e) =>
                    gE(e.value) && e.value.length > n
                      ? {
                          maxlength: {
                            requiredLength: n,
                            actualLength: e.value.length,
                          },
                        }
                      : null;
                })(t));
          }
        }
        return (
          (n.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = st(n)))(r || n);
            };
          })()),
          (n.ɵdir = Y({
            type: n,
            selectors: [
              ["", "maxlength", "", "formControlName", ""],
              ["", "maxlength", "", "formControl", ""],
              ["", "maxlength", "", "ngModel", ""],
            ],
            hostVars: 1,
            hostBindings: function (t, r) {
              2 & t && kn("maxlength", r._enabled ? r.maxlength : null);
            },
            inputs: { maxlength: "maxlength" },
            features: [Re([kL]), ve],
          })),
          n
        );
      })();
      const OL = { provide: _t, useExisting: Se(() => kr), multi: !0 };
      let kr = (() => {
          class n extends ci {
            constructor() {
              super(...arguments),
                (this.inputName = "pattern"),
                (this.normalizeInput = (t) => t),
                (this.createValidator = (t) =>
                  (function EE(n) {
                    if (!n) return Du;
                    let e, t;
                    return (
                      "string" == typeof n
                        ? ((t = ""),
                          "^" !== n.charAt(0) && (t += "^"),
                          (t += n),
                          "$" !== n.charAt(n.length - 1) && (t += "$"),
                          (e = new RegExp(t)))
                        : ((t = n.toString()), (e = n)),
                      (r) => {
                        if (Rr(r.value)) return null;
                        const i = r.value;
                        return e.test(i)
                          ? null
                          : { pattern: { requiredPattern: t, actualValue: i } };
                      }
                    );
                  })(t));
            }
          }
          return (
            (n.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = st(n)))(r || n);
              };
            })()),
            (n.ɵdir = Y({
              type: n,
              selectors: [
                ["", "pattern", "", "formControlName", ""],
                ["", "pattern", "", "formControl", ""],
                ["", "pattern", "", "ngModel", ""],
              ],
              hostVars: 1,
              hostBindings: function (t, r) {
                2 & t && kn("pattern", r._enabled ? r.pattern : null);
              },
              inputs: { pattern: "pattern" },
              features: [Re([OL]), ve],
            })),
            n
          );
        })(),
        LL = (() => {
          class n {}
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵmod = Qt({ type: n })),
            (n.ɵinj = Pt({ imports: [YE] })),
            n
          );
        })(),
        $L = (() => {
          class n {
            static withConfig(t) {
              return {
                ngModule: n,
                providers: [
                  { provide: zs, useValue: t.callSetDisabledState ?? Wh },
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵmod = Qt({ type: n })),
            (n.ɵinj = Pt({ imports: [LL] })),
            n
          );
        })();
      function UL(n, e) {
        if ((1 & n && (h(0, "option", 8), _(1), f()), 2 & n)) {
          const t = e.$implicit;
          v("value", e.index), y(1), Fe(" ", t, " ");
        }
      }
      function BL(n, e) {
        if ((1 & n && (h(0, "option", 8), _(1), f()), 2 & n)) {
          const t = e.$implicit;
          v("value", t), y(1), Fe(" ", t, " ");
        }
      }
      function jL(n, e) {
        1 & n && B(0, "div");
      }
      function HL(n, e) {
        if (
          (1 & n &&
            (h(0, "tr")(1, "td", 15),
            _(2),
            f(),
            h(3, "td"),
            _(4),
            f(),
            h(5, "td"),
            _(6),
            f()()),
          2 & n)
        ) {
          const t = e.$implicit;
          y(2),
            de(t.title),
            y(2),
            wr("", t.date[8], "", t.date[9], ""),
            y(2),
            de(t.price);
        }
      }
      function GL(n, e) {
        if (
          (1 & n &&
            (h(0, "section", 9)(1, "div", 10),
            _(2, "Total"),
            f(),
            h(3, "div"),
            _(4),
            f()(),
            h(5, "table", 11)(6, "thead")(7, "tr")(8, "th", 12),
            _(9, "Expence"),
            f(),
            h(10, "th", 13),
            _(11, "Day"),
            f(),
            h(12, "th", 13),
            _(13, "$"),
            f()()(),
            h(14, "tbody"),
            b(15, HL, 7, 4, "tr", 14),
            f()()),
          2 & n)
        ) {
          const t = D();
          y(4),
            Fe("", t.total(), " $"),
            y(11),
            v("ngForOf", t.filteredExpences);
        }
      }
      function zL(n, e) {
        if ((1 & n && (h(0, "h2", 16), _(1), f()), 2 & n)) {
          const t = D();
          y(1),
            wr(
              " No Expences Found in ",
              t.getMonthName(t.selectMonth),
              " ",
              t.selectYear,
              " "
            );
        }
      }
      class Ks {
        constructor(e) {
          (this._expencesService = e),
            (this.EXPENCES = []),
            (this.filteredExpences = []),
            (this.selectMonth = ""),
            (this.selectYear = ""),
            (this.dataFound = !1),
            (this.monthName = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]),
            (this.yearRange = Array.from({ length: 54 }, (t, r) => 2022 + r));
        }
        ngOnInit() {
          this._expencesService.REFRESH$.subscribe(() => {
            this.filterData();
          }),
            (this.selectMonth = new Date().getMonth().toString()),
            (this.selectYear = new Date().getFullYear().toString());
        }
        filterData() {
          (this.filteredExpences = this.EXPENCES.filter((e) =>
            e.date.startsWith(
              this.formatDate(
                parseInt(this.selectYear),
                parseInt(this.selectMonth)
              )
            )
          )),
            (this.filteredExpences = this.sortByDate(this.filteredExpences)),
            (this.dataFound = 0 != this.filteredExpences.length);
        }
        formatDate(e, t) {
          return `${e}-${(t += 1) < 10 ? `0${t}` : String(t)}`;
        }
        getMonthName(e) {
          return this.monthName[parseInt(e)];
        }
        total() {
          return this.filteredExpences.reduce((e, t) => e + t.price, 0);
        }
        sortByDate(e) {
          return e.sort(
            (t, r) => new Date(r.date).getTime() - new Date(t.date).getTime()
          );
        }
      }
      function qL(n, e) {
        if ((1 & n && (h(0, "h3", 17), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), Fe(" ", t.errorMSG, " ");
        }
      }
      function WL(n, e) {
        1 & n && (h(0, "small"), _(1, " it's too short"), f());
      }
      function KL(n, e) {
        if (
          (1 & n && (h(0, "div", 18), b(1, WL, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(8);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function QL(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function YL(n, e) {
        if (
          (1 & n && (h(0, "div", 18), b(1, QL, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(21);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      function XL(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div")(1, "form", 1, 2),
            x("ngSubmit", function () {
              $(t);
              const i = I(2);
              return U(D().addExpence(i));
            }),
            h(3, "h1", 3),
            _(4, "Add Expence"),
            f(),
            b(5, qL, 2, 1, "h3", 4),
            h(6, "div", 5)(7, "input", 6, 7),
            x("ngModelChange", function (i) {
              return $(t), U((D().expence.title = i));
            }),
            f(),
            h(9, "label", 8),
            _(10, "Expence"),
            f(),
            b(11, KL, 2, 1, "div", 9),
            f(),
            h(12, "div", 10)(13, "div", 11),
            _(14, "Date:"),
            f(),
            h(15, "input", 12, 13),
            x("ngModelChange", function (i) {
              return $(t), U((D().expence.date = i));
            }),
            f()(),
            h(17, "div", 10)(18, "div", 11),
            _(19, "$"),
            f(),
            h(20, "input", 14, 15),
            x("ngModelChange", function (i) {
              return $(t), U((D().expence.price = i));
            }),
            f()(),
            b(22, YL, 2, 1, "div", 9),
            h(23, "button", 16),
            _(24, " Submit "),
            f()()();
        }
        if (2 & n) {
          const t = I(2),
            r = I(8),
            i = I(16),
            o = I(21),
            s = D();
          y(5),
            v("ngIf", "" != s.errorMSG),
            y(2),
            be("is-invalid", r.invalid && r.touched),
            v("ngModel", s.expence.title),
            y(4),
            v("ngIf", r.invalid && r.touched),
            y(4),
            be("is-invalid", i.invalid && i.touched),
            v("ngModel", s.expence.date),
            y(5),
            be("is-invalid", o.invalid && o.touched),
            v("ngModel", s.expence.price),
            y(2),
            v("ngIf", o.invalid && o.touched),
            y(1),
            v("disabled", t.form.invalid || !0 === s.loading);
        }
      }
      (Ks.ɵfac = function (e) {
        return new (e || Ks)(M(jn));
      }),
        (Ks.ɵcmp = Ae({
          type: Ks,
          selectors: [["app-monthly-expences"]],
          inputs: { EXPENCES: "EXPENCES" },
          decls: 11,
          vars: 7,
          consts: [
            [1, "text-bg-dark", "py-2"],
            [1, "d-flex", "selectflex"],
            [
              "name",
              "month",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            [3, "value", 4, "ngFor", "ngForOf"],
            [
              "name",
              "year",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "value"],
            [1, "text-bg-dark", "border"],
            [1, "ps-3", "text-start", "bold"],
            [1, "table", "table-dark", "table-striped", "text-center"],
            ["scope", "col", 1, "col", "text-start"],
            ["scope", "col", 1, "col-1"],
            [4, "ngFor", "ngForOf"],
            [1, "text-start"],
            [1, "text-center", "text-bg-dark", "py-5", "border"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "div", 0)(1, "div", 1)(2, "select", 2),
                x("ngModelChange", function (i) {
                  return (t.selectMonth = i);
                })("change", function () {
                  return t.filterData();
                }),
                b(3, UL, 2, 2, "option", 3),
                f(),
                h(4, "select", 4),
                x("ngModelChange", function (i) {
                  return (t.selectYear = i);
                })("change", function () {
                  return t.filterData();
                }),
                b(5, BL, 2, 2, "option", 3),
                f()()(),
                b(6, jL, 1, 0, "div", 5),
                b(7, GL, 16, 2, "ng-template", null, 6, W),
                b(9, zL, 2, 2, "ng-template", null, 7, W)),
              2 & e)
            ) {
              const r = I(8),
                i = I(10);
              y(2),
                v("ngModel", t.selectMonth),
                y(1),
                v("ngForOf", t.monthName),
                y(1),
                v("ngModel", t.selectYear),
                y(1),
                v("ngForOf", t.yearRange),
                y(1),
                v("ngIf", t.dataFound)("ngIfThen", r)("ngIfElse", i);
            }
          },
          dependencies: [$n, $e, xu, Ru, vo, jt, Rt],
          styles: [
            ".selectflex[_ngcontent-%COMP%]{display:flex;justify-content:center}select[_ngcontent-%COMP%]{width:140px;height:35px;margin:0 10px}section[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 90px;padding:10px 0}.bold[_ngcontent-%COMP%]{font-weight:bolder}",
          ],
        }));
      class Qs {
        constructor(e) {
          (this._expencesService = e),
            (this.sendRefreshReq = new he()),
            (this.date = new Date()),
            (this.expence = new vu()),
            (this.errorMSG = ""),
            (this.refresh = !1),
            (this.loading = !1);
        }
        ngOnInit() {
          this._expencesService.REFRESH$.subscribe((e) => {
            (this.expence = new vu()),
              (this.expence.date = this.formatDate(
                this.date.getDate(),
                this.date.getFullYear(),
                this.date.getMonth()
              )),
              (this.refresh = e);
          });
        }
        addExpence(e) {
          (this.loading = !0),
            this._expencesService.addNewExpence(this.expence).subscribe({
              next: () => {
                e.reset(), (this.loading = !1), this.sendRefreshReq.emit();
              },
              error: (t) => {
                (this.loading = !1),
                  (this.errorMSG = t.status),
                  (this.errorMSG =
                    401 === t.status
                      ? "Unauthorized"
                      : 403 === t.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
      }
      function ZL(n, e) {
        1 & n && (h(0, "small"), _(1, "it's too short"), f());
      }
      function JL(n, e) {
        if (
          (1 & n && (h(0, "div", 26), b(1, ZL, 2, 0, "small", 27), f()), 2 & n)
        ) {
          D();
          const t = I(13);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function eV(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function tV(n, e) {
        if (
          (1 & n && (h(0, "div", 26), b(1, eV, 2, 0, "small", 27), f()), 2 & n)
        ) {
          D();
          const t = I(26);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      function nV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 28)(1, "label", 29),
            _(2, "notes"),
            f(),
            h(3, "textarea", 30),
            x("ngModelChange", function (i) {
              return $(t), U((D().expence.notes = i));
            }),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(3), v("ngModel", t.expence.notes);
        }
      }
      (Qs.ɵfac = function (e) {
        return new (e || Qs)(M(jn));
      }),
        (Qs.ɵcmp = Ae({
          type: Qs,
          selectors: [["app-add-expence"]],
          outputs: { sendRefreshReq: "sendRefreshReq" },
          decls: 1,
          vars: 1,
          consts: [
            [4, "ngIf"],
            [
              "autocomplete",
              "off",
              1,
              "text-bg-dark",
              "pt-3",
              "px-3",
              "rounded-bottom",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["addExpenceForm", "ngForm"],
            [1, "py-3", "text-center"],
            ["class", "text-center text-danger", 4, "ngIf"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "Expence-title",
              "placeholder",
              "Expence-title",
              "minlength",
              "3",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["ExpenceTitle", "ngModel"],
            ["for", "add-Expence-title", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "date",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["ExpenceDate", "ngModel"],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["ExpencePrice", "ngModel"],
            [
              "type",
              "submit",
              1,
              "btn",
              "btn-secondary",
              "my-5",
              3,
              "disabled",
            ],
            [1, "text-center", "text-danger"],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            1 & e && b(0, XL, 25, 13, "div", 0),
              2 & e && v("ngIf", !1 === t.refresh);
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, kr, Rt, sn],
        }));
      class Ys {
        constructor(e, t) {
          (this._expencesService = e),
            (this._loginService = t),
            (this.Refresh = new he()),
            (this.expence = new vu()),
            (this.errorMSG = ""),
            (this.roles = []);
        }
        ngOnInit() {
          this.roles = this._loginService.haveAccess().UserInfo.roles;
        }
        sendRefreshReq() {
          this.Refresh.emit();
        }
        onSubmit(e) {
          this._expencesService
            .editExpence(this.expence._id, this.expence)
            .subscribe({
              next: () => {
                this.sendRefreshReq(), e.reset(), this.closeModal();
              },
              error: (t) => {
                401 === t.status && (this.errorMSG = "Unauthorized"),
                  403 === t.status && (this.errorMSG = "Forbiden"),
                  404 === t.status && (this.errorMSG = "Expence Not Found"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 2e3);
              },
            });
        }
        closeModal() {
          let e = document.getElementById("edit-Expence-close"),
            t = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !0,
            });
          e.dispatchEvent(t);
        }
      }
      function rV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 1)(1, "button", 20),
            x("click", function () {
              return $(t), U(D().refreshMonthly(!1));
            }),
            _(2, " Add Expence "),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(1), v("disabled", t.loading);
        }
      }
      function iV(n, e) {
        1 & n && B(0, "div", 21);
      }
      function oV(n, e) {
        1 & n && (h(0, "th", 28), B(1, "i", 31), f());
      }
      function sV(n, e) {
        1 & n && (h(0, "th", 28), B(1, "i", 32), f());
      }
      function aV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "td", 34)(1, "button", 36),
            x("click", function () {
              $(t);
              const i = D().$implicit;
              return U(D(2).setSelectedExpence(i));
            }),
            B(2, "i", 31),
            f()();
        }
      }
      function lV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "td", 34)(1, "button", 37),
            x("click", function () {
              $(t);
              const i = D().$implicit;
              return U(D(2).DeleteExpence(i));
            }),
            B(2, "i", 32),
            f()();
        }
      }
      function uV(n, e) {
        if (
          (1 & n &&
            (h(0, "tr")(1, "td", 33),
            _(2),
            f(),
            h(3, "td", 34),
            _(4),
            f(),
            b(5, aV, 3, 0, "td", 35),
            b(6, lV, 3, 0, "td", 35),
            f()),
          2 & n)
        ) {
          const t = e.$implicit,
            r = D(2);
          y(2),
            de(t.title),
            y(2),
            de(t.price),
            y(1),
            v("ngIf", !0 === r.isAdmin),
            y(1),
            v("ngIf", !0 === r.isAdmin);
        }
      }
      function cV(n, e) {
        if (
          (1 & n &&
            (h(0, "div")(1, "div", 22)(2, "h2", 23),
            _(3),
            f()(),
            h(4, "div", 24),
            _(5),
            f(),
            h(6, "div", 25)(7, "table", 26)(8, "thead")(9, "tr")(10, "th", 27),
            _(11, "Expence"),
            f(),
            h(12, "th", 28),
            _(13, "$"),
            f(),
            b(14, oV, 2, 0, "th", 29),
            b(15, sV, 2, 0, "th", 29),
            f()(),
            h(16, "tbody"),
            b(17, uV, 7, 4, "tr", 30),
            f()()()()),
          2 & n)
        ) {
          const t = D();
          y(3),
            wr("", t.day, " ", t.monthName[t.month2], ""),
            y(2),
            de(t.errorMSG3),
            y(9),
            v("ngIf", !0 === t.isAdmin),
            y(1),
            v("ngIf", !0 === t.isAdmin),
            y(2),
            v("ngForOf", t.dailyExpences);
        }
      }
      function dV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 38)(1, "app-add-expence", 39),
            x("sendRefreshReq", function (i) {
              return $(t), U(D().handleModals(i));
            }),
            f()();
        }
      }
      function fV(n, e) {}
      function hV(n, e) {
        1 & n && B(0, "div");
      }
      function pV(n, e) {
        1 & n && (h(0, "h1"), _(1, "Loading ..."), f());
      }
      function gV(n, e) {
        if ((1 & n && (h(0, "h4", 44), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), de(t.errorMSG);
        }
      }
      function mV(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 40),
            b(1, hV, 1, 0, "div", 41),
            b(2, pV, 2, 0, "ng-template", null, 42, W),
            b(4, gV, 2, 1, "ng-template", null, 43, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D();
          y(1), v("ngIf", "" == i.errorMSG)("ngIfThen", t)("ngIfElse", r);
        }
      }
      function _V(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "app-show-expence", 45),
            x("Refresh", function (i) {
              return $(t), U(D().handleModals(i));
            }),
            f();
        }
        2 & n && v("expence", D().selectedExpence);
      }
      (Ys.ɵfac = function (e) {
        return new (e || Ys)(M(jn), M(mt));
      }),
        (Ys.ɵcmp = Ae({
          type: Ys,
          selectors: [["app-show-expence"]],
          inputs: { expence: "expence" },
          outputs: { Refresh: "Refresh" },
          decls: 36,
          vars: 14,
          consts: [
            [
              "id",
              "edit-Expence-modal",
              "tabindex",
              "-1",
              "data-bs-backdrop",
              "static",
              "data-bs-keyboard",
              "false",
              "role",
              "dialog",
              "aria-labelledby",
              "edit-Expence-modal-title",
              "aria-hidden",
              "true",
              1,
              "modal",
              "fade",
            ],
            [
              "role",
              "document",
              1,
              "modal-dialog",
              "modal-dialog-scrollable",
              "modal-dialog-centered",
              "modal-sm",
            ],
            [1, "modal-content", "bg-dark"],
            [1, "modal-header"],
            [1, "modal-title", "text-bg-dark"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "aria-label",
              "Close",
              1,
              "btn-close",
            ],
            [1, "modal-body", "bg-secondary"],
            [
              "autocomplete",
              "off",
              "novalidate",
              "",
              1,
              "text-bg-secondary",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["editExpenceForm", "ngForm"],
            ["ngModelGroup", "", "name", "person"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "name",
              "placeholder",
              "customer-info",
              "minlength",
              "3",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["CustomerName", "ngModel"],
            ["for", "edit-Expence-name", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "date",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Date", "ngModel"],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Price", "ngModel"],
            ["class", "mb-3", 4, "ngIf"],
            [1, "text-danger", "text-center"],
            ["type", "submit", 1, "btn", "btn-dark", "mb-3", 3, "disabled"],
            [1, "modal-footer"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "id",
              "edit-Expence-close",
              1,
              "btn",
              "btn-secondary",
            ],
            [1, "text-danger"],
            [4, "ngIf"],
            [1, "mb-3"],
            ["for", "edit-Expence-notes", 1, "form-label"],
            [
              "name",
              "notes",
              "rows",
              "1",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
          ],
          template: function (e, t) {
            if (1 & e) {
              const r = se();
              h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h5", 4),
                _(5, "Expence"),
                f(),
                B(6, "button", 5),
                f(),
                h(7, "div", 6)(8, "form", 7, 8),
                x("ngSubmit", function () {
                  $(r);
                  const o = I(9);
                  return U(t.onSubmit(o));
                }),
                h(10, "div", 9)(11, "div", 10)(12, "input", 11, 12),
                x("ngModelChange", function (o) {
                  return (t.expence.title = o);
                }),
                f(),
                h(14, "label", 13),
                _(15, "Expence"),
                f(),
                b(16, JL, 2, 1, "div", 14),
                f()(),
                h(17, "div", 15)(18, "div", 16),
                _(19, "Date:"),
                f(),
                h(20, "input", 17, 18),
                x("ngModelChange", function (o) {
                  return (t.expence.date = o);
                }),
                f()(),
                h(22, "div", 15)(23, "div", 16),
                _(24, "$"),
                f(),
                h(25, "input", 19, 20),
                x("ngModelChange", function (o) {
                  return (t.expence.price = o);
                }),
                f()(),
                b(27, tV, 2, 1, "div", 14),
                b(28, nV, 4, 1, "div", 21),
                h(29, "div", 22),
                _(30),
                f(),
                h(31, "button", 23),
                _(32, " Edit "),
                f()()(),
                h(33, "div", 24)(34, "button", 25),
                _(35, " Close "),
                f()()()()();
            }
            if (2 & e) {
              const r = I(9),
                i = I(13),
                o = I(21),
                s = I(26);
              y(12),
                be("is-invalid", i.invalid && i.touched),
                v("ngModel", t.expence.title),
                y(4),
                v("ngIf", i.invalid && i.touched),
                y(4),
                be("is-invalid", o.invalid && o.touched),
                v("ngModel", t.expence.date),
                y(5),
                be("is-invalid", s.invalid && s.touched),
                v("ngModel", t.expence.price),
                y(2),
                v("ngIf", s.invalid && s.touched),
                y(1),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001)),
                y(2),
                de(t.errorMSG),
                y(1),
                v("disabled", r.form.invalid);
            }
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, di, kr, Rt, yo, sn],
        }));
      class Xs {
        constructor(e, t) {
          (this._expencesService = e),
            (this._loginService = t),
            (this.isAdmin = !1),
            (this.isEditor = !1),
            (this.loading = !0),
            (this.errorMSG = ""),
            (this.errorMSG2 = ""),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.currentDate = ""),
            (this.EXPENCES = []),
            (this.day = 0),
            (this.month2 = 0),
            (this.dailyExpences = []),
            (this.errorMSG3 = ""),
            (this.selectedExpence = new vu()),
            (this.monthName = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]);
        }
        ngOnInit() {
          this.getAllExpences(),
            this.setCurrentDate(),
            (this.isAdmin = !!this._loginService
              .haveAccess()
              .UserInfo.roles.includes(5150)),
            (this.isEditor = !!this._loginService
              .haveAccess()
              .UserInfo.roles.includes(2001));
        }
        sendCalendarData() {
          return {
            firstDay: new Date(this.year, this.month).getDay(),
            daysInMonth: 32 - new Date(this.year, this.month, 32).getDate(),
          };
        }
        dailyDateSetter(e) {
          (this.day = e.day),
            (this.month2 = e.month),
            this.setDailyExpences(this.formatDate(e.day, this.year, e.month));
        }
        prev() {
          this.month--,
            this.month < 0 && ((this.month = 11), this.year--),
            this.setCurrentDate();
        }
        next() {
          this.month++,
            this.month > 11 && ((this.month = 0), this.year++),
            this.setCurrentDate();
        }
        setCurrentDate() {
          this.currentDate = `${this.monthName[this.month]} ${this.year}`;
        }
        handleModals(e) {
          this.getAllExpences();
        }
        setDailyExpences(e) {
          this.dailyExpences = this.EXPENCES.filter((t) => t.date === e);
        }
        setSelectedExpence(e) {
          this.selectedExpence = { ...e };
        }
        getAllExpences() {
          (this.errorMSG2 = ""),
            (this.loading = !0),
            this._expencesService.getAllExpences().subscribe({
              next: (e) => {
                (this.EXPENCES = e.expences),
                  this.setDailyExpences(
                    this.formatDate(this.day, this.year, this.month)
                  ),
                  this._expencesService.setREFRESH(!1),
                  (this.loading = !1),
                  (this.errorMSG2 = "");
              },
              error: (e) => {
                (this.errorMSG = e.status),
                  (this.errorMSG2 = "Unexpected Error Occured"),
                  (this.errorMSG =
                    401 === e.status
                      ? "Unauthorized"
                      : 403 === e.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
        DeleteExpence(e) {
          1 == window.confirm("Confirm delete") &&
            this._expencesService.deleteExpence(e._id).subscribe({
              next: () => {
                this.getAllExpences(),
                  this.dailyExpences.splice(this.dailyExpences.indexOf(e), 1),
                  0 == this.dailyExpences.length && (this.day = 0);
              },
              error: (r) => {
                (this.errorMSG3 =
                  401 === r.status
                    ? "Unauthorized"
                    : 403 === r.status
                    ? "Forbiden"
                    : 404 === r.status
                    ? "Expence Not Found"
                    : "Unexpected Error Occured"),
                  setTimeout(() => {
                    this.errorMSG3 = "";
                  }, 2e3);
              },
            });
        }
        refreshMonthly(e) {
          this._expencesService.setREFRESH(e);
        }
      }
      (Xs.ɵfac = function (e) {
        return new (e || Xs)(M(jn), M(mt));
      }),
        (Xs.ɵcmp = Ae({
          type: Xs,
          selectors: [["app-expences"]],
          decls: 31,
          vars: 16,
          consts: [
            [
              "id",
              "add-Expences-tab",
              "role",
              "tablist",
              1,
              "nav",
              "nav-tabs",
              "text-bg-dark",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            ["role", "presentation", 1, "nav-item"],
            [
              "id",
              "daily-Expences-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#daily-Expences",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "daily-Expences",
              "aria-selected",
              "true",
              1,
              "nav-link",
              "active",
              3,
              "disabled",
            ],
            [
              "id",
              "monthly-Expences-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#monthly-Expences",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "monthly-Expences",
              "aria-selected",
              "false",
              1,
              "nav-link",
              3,
              "disabled",
              "click",
            ],
            ["class", "nav-item", "role", "presentation", 4, "ngIf"],
            ["class", "csmb", 4, "ngIf", "ngIfThen", "ngIfElse"],
            [1, "tab-content", "mx-auto", 2, "max-width", "600px"],
            [
              "id",
              "daily-Expences",
              "role",
              "tabpanel",
              "aria-labelledby",
              "daily-Expences-tab",
              1,
              "tab-pane",
              "active",
            ],
            [
              "id",
              "reservations-section",
              1,
              "text-bg-secondary",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            [
              1,
              "d-flex",
              "justify-content-around",
              "align-items-center",
              "p-2",
              "text-bg-dark",
              "border-bottom",
              "border-secondary",
            ],
            [1, "btn", "btn-secondary", 3, "click"],
            [
              1,
              "d-flex",
              "justify-content-center",
              "align-items-center",
              "p-2",
              "text-bg-dark",
            ],
            [
              3,
              "month",
              "year",
              "daysInMonth",
              "firstDay",
              "EXPENCES",
              "sendDate",
            ],
            [4, "ngIf"],
            [
              "id",
              "monthly-Expences",
              "role",
              "tabpanel",
              "aria-labelledby",
              "monthly-Expences-tab",
              1,
              "tab-pane",
            ],
            [3, "EXPENCES"],
            [
              "class",
              "tab-pane",
              "id",
              "add-Expences",
              "role",
              "tabpanel",
              "aria-labelledby",
              "add-Expences-tab",
              4,
              "ngIf",
            ],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "expence", "Refresh", 4, "ngIf"],
            [
              "id",
              "add-Expences-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#add-Expences",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "add-Expences",
              "aria-selected",
              "false",
              1,
              "nav-link",
              3,
              "disabled",
              "click",
            ],
            [1, "csmb"],
            [1, "text-center", "text-bg-dark", "mt-2"],
            [1, "my-0"],
            [1, "text-center", "text-danger"],
            [1, "table-responsive"],
            [1, "table", "table-dark", "table-striped", "text-center"],
            ["scope", "col", 1, "col", "text-start"],
            ["scope", "col", 1, "col-1"],
            ["scope", "col", "class", "col-1", 4, "ngIf"],
            [4, "ngFor", "ngForOf"],
            [1, "fas", "fa-edit"],
            [1, "fas", "fa-trash"],
            [1, "text-start"],
            [1, "text-center"],
            ["class", "text-center", 4, "ngIf"],
            [
              "data-bs-toggle",
              "modal",
              "data-bs-target",
              "#edit-Expence-modal",
              1,
              "btn",
              "btn-sm",
              "btn-outline-info",
              3,
              "click",
            ],
            [1, "btn", "btn-sm", "btn-outline-danger", 3, "click"],
            [
              "id",
              "add-Expences",
              "role",
              "tabpanel",
              "aria-labelledby",
              "add-Expences-tab",
              1,
              "tab-pane",
            ],
            [3, "sendRefreshReq"],
            [1, "text-center", "text-bg-secondary"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "text-danger"],
            [3, "expence", "Refresh"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "ul", 0)(1, "li", 1)(2, "button", 2),
                _(3, " Daily "),
                f()(),
                h(4, "li", 1)(5, "button", 3),
                x("click", function () {
                  return t.refreshMonthly(!0);
                }),
                _(6, " Monthly "),
                f()(),
                b(7, rV, 3, 1, "li", 4),
                f(),
                b(8, iV, 1, 0, "div", 5),
                h(9, "div", 6)(10, "div", 7)(11, "section", 8)(12, "div", 9)(
                  13,
                  "button",
                  10
                ),
                x("click", function () {
                  return t.prev();
                }),
                _(14, "<<"),
                f(),
                h(15, "span"),
                _(16),
                f(),
                h(17, "button", 10),
                x("click", function () {
                  return t.next();
                }),
                _(18, ">>"),
                f()(),
                h(19, "div", 11),
                _(20, " Expences "),
                f(),
                h(21, "app-expences-calendar", 12),
                x("sendDate", function (i) {
                  return t.dailyDateSetter(i);
                }),
                f(),
                b(22, cV, 18, 6, "div", 13),
                f()(),
                h(23, "div", 14),
                B(24, "app-monthly-expences", 15),
                f(),
                b(25, dV, 2, 0, "div", 16),
                f(),
                b(26, fV, 0, 0, "ng-template", null, 17, W),
                b(28, mV, 6, 3, "ng-template", null, 18, W),
                b(30, _V, 1, 1, "app-show-expence", 19)),
              2 & e)
            ) {
              const r = I(27),
                i = I(29);
              y(2),
                v("disabled", t.loading),
                y(3),
                v("disabled", t.loading),
                y(2),
                v("ngIf", !0 === t.isAdmin || !0 === t.isEditor),
                y(1),
                v("ngIf", !t.loading)("ngIfThen", r)("ngIfElse", i),
                y(8),
                de(t.currentDate),
                y(5),
                v("month", t.month)("year", t.year)(
                  "daysInMonth",
                  t.sendCalendarData().daysInMonth
                )("firstDay", t.sendCalendarData().firstDay)(
                  "EXPENCES",
                  t.EXPENCES
                ),
                y(1),
                v("ngIf", 0 !== t.day && !t.loading),
                y(2),
                v("EXPENCES", t.EXPENCES),
                y(1),
                v("ngIf", !0 === t.isAdmin || !0 === t.isEditor),
                y(5),
                v("ngIf", !0 === t.isAdmin);
            }
          },
          dependencies: [$n, $e, js, Ks, Qs, Ys],
        }));
      class np {
        constructor() {
          (this.username = ""), (this.accessToken = ""), (this.roles = []);
        }
      }
      class hr {
        constructor(e) {
          (this.http = e), (this.DATA = new np());
        }
        getAllReservations() {
          return this.http
            .get(`${ze}/reservations`)
            .pipe(Ce((e) => Ie(() => e)));
        }
        scaleup() {
          return this.http.get(`${ze}/data`).pipe(Ce((e) => Ie(() => e)));
        }
        addNewReservation(e) {
          return this.http
            .post(`${ze}/reservations`, e)
            .pipe(Ce((t) => Ie(() => t)));
        }
        editReservation(e, t, r) {
          return this.http
            .patch(`${ze}/reservations/${e}/date/${t}`, r)
            .pipe(Ce((i) => Ie(() => i)));
        }
        deleteReservation(e, t) {
          return this.http
            .delete(`${ze}/reservations/${e}/date/${t}`)
            .pipe(Ce((r) => Ie(() => r)));
        }
      }
      function yV(n, e) {
        1 & n && B(0, "div", 7);
      }
      function vV(n, e) {
        1 & n &&
          (h(0, "div")(1, "h1", 8),
          _(2, "Loading ..."),
          f(),
          h(3, "p", 9),
          _(4, "it may take a few minutes"),
          f()());
      }
      function CV(n, e) {
        1 & n && B(0, "div");
      }
      function DV(n, e) {
        if ((1 & n && b(0, CV, 1, 0, "div", 10), 2 & n)) {
          const t = D(),
            r = I(8),
            i = I(10);
          v("ngIf", !t.error)("ngIfThen", r)("ngIfElse", i);
        }
      }
      function bV(n, e) {
        1 & n && (h(0, "a", 11), _(1, " Log in "), f());
      }
      function EV(n, e) {
        1 & n &&
          (h(0, "div")(1, "h1", 12),
          _(2, "An unexpected error occurred"),
          f(),
          h(3, "p", 12),
          _(4, "try again later"),
          f()());
      }
      (hr.ɵfac = function (e) {
        return new (e || hr)(N(go));
      }),
        (hr.ɵprov = O({ token: hr, factory: hr.ɵfac, providedIn: "root" }));
      class Zs {
        constructor(e) {
          (this._reservationService = e),
            (this.loading = !0),
            (this.error = !1);
        }
        ngOnInit() {
          this._reservationService.scaleup().subscribe({
            next: () => {
              (this.error = !1), (this.loading = !1);
            },
            error: () => {
              (this.error = !0), (this.loading = !1);
            },
          });
        }
      }
      function wV(n, e) {
        1 & n && (h(0, "small"), _(1, "username is required"), f());
      }
      function SV(n, e) {
        1 & n && (h(0, "small"), _(1, "username is too short"), f());
      }
      function MV(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 13),
            b(1, wV, 2, 0, "small", 14),
            b(2, SV, 2, 0, "small", 14),
            f()),
          2 & n)
        ) {
          D();
          const t = I(7);
          y(1),
            v("ngIf", null == t.errors ? null : t.errors.required),
            y(1),
            v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function TV(n, e) {
        1 & n && (h(0, "small", 13), _(1, "Password is required"), f());
      }
      (Zs.ɵfac = function (e) {
        return new (e || Zs)(M(hr));
      }),
        (Zs.ɵcmp = Ae({
          type: Zs,
          selectors: [["app-home"]],
          decls: 11,
          vars: 3,
          consts: [
            [1, "text-center"],
            ["src", "./assets/JM - P.jpeg", "alt", "JM-Realestate"],
            ["class", "csmb", 4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "csmb"],
            [1, "zoom-text"],
            [1, ""],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            [
              "routerLink",
              "/login",
              "routerLinkActive",
              "activebutton",
              "ariaCurrentWhenActive",
              "page",
              1,
              "btn",
              "btn-dark",
              "mx-auto",
              "my-4",
              "text-warning",
              "nav-link",
            ],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "div", 0),
                B(1, "img", 1),
                b(2, yV, 1, 0, "div", 2),
                f(),
                b(3, vV, 5, 0, "ng-template", null, 3, W),
                b(5, DV, 1, 3, "ng-template", null, 4, W),
                b(7, bV, 2, 0, "ng-template", null, 5, W),
                b(9, EV, 5, 0, "ng-template", null, 6, W)),
              2 & e)
            ) {
              const r = I(4),
                i = I(6);
              y(2), v("ngIf", t.loading)("ngIfThen", r)("ngIfElse", i);
            }
          },
          dependencies: [$e, ho, Ah],
          styles: [
            "img[_ngcontent-%COMP%]{width:90vw;max-width:500px}a[_ngcontent-%COMP%]{max-width:150px}@keyframes _ngcontent-%COMP%_zoom{0%{transform:scale(1)}50%{transform:scale(.8)}to{transform:scale(1)}}.zoom-text[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_zoom 3s ease-in-out infinite}",
          ],
        }));
      class Js {
        constructor(e, t) {
          (this._loginService = e),
            (this.router = t),
            (this.username = ""),
            (this.password = ""),
            (this.errorMSG = "");
        }
        onSubmit() {
          this._loginService
            .login(this.username.toLocaleLowerCase(), this.password)
            .subscribe({
              next: (e) => {
                this._loginService.setIsRefreshToken(!1),
                  this._loginService.setDATA(e),
                  sessionStorage.setItem("Token", e.accessToken),
                  (this.username = ""),
                  (this.password = ""),
                  this.router.navigate(["/reservations"]);
              },
              error: (e) => {
                401 === e.status &&
                  ((this.errorMSG = "username or password are incorrect"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 3e3));
              },
            });
        }
      }
      (Js.ɵfac = function (e) {
        return new (e || Js)(M(mt), M(ut));
      }),
        (Js.ɵcmp = Ae({
          type: Js,
          selectors: [["app-login"]],
          decls: 21,
          vars: 10,
          consts: [
            [1, "mx-1"],
            [
              "autocomplete",
              "off",
              "novalidate",
              "",
              1,
              "text-bg-dark",
              "pt-3",
              "px-3",
              "rounded-4",
              "d-flex",
              "flex-column",
              "border",
              "border-dark",
              "border-3",
              "mx-auto",
              3,
              "ngSubmit",
            ],
            ["loginForm", "ngForm"],
            [1, "py-3", "text-center"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "username",
              "placeholder",
              "username",
              "required",
              "",
              "minlength",
              "5",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["usernameInput", "ngModel"],
            [1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [
              "type",
              "password",
              "name",
              "password",
              "placeholder",
              "username",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["passwordInput", "ngModel"],
            [1, "btn", "btn-secondary", "mb-3", 3, "disabled"],
            [1, "text-danger", "text-center"],
            [1, "text-danger"],
            [4, "ngIf"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "div", 0)(1, "form", 1, 2),
                x("ngSubmit", function () {
                  return t.onSubmit();
                }),
                h(3, "h1", 3),
                _(4, "Log in"),
                f(),
                h(5, "div", 4)(6, "input", 5, 6),
                x("ngModelChange", function (i) {
                  return (t.username = i);
                }),
                f(),
                h(8, "label", 7),
                _(9, "Username"),
                f(),
                b(10, MV, 3, 2, "div", 8),
                f(),
                h(11, "div", 4)(12, "input", 9, 10),
                x("ngModelChange", function (i) {
                  return (t.password = i);
                }),
                f(),
                h(14, "label", 7),
                _(15, "Password"),
                f(),
                b(16, TV, 2, 0, "small", 8),
                f(),
                h(17, "button", 11),
                _(18, " Log in "),
                f(),
                h(19, "div", 12),
                _(20),
                f()()()),
              2 & e)
            ) {
              const r = I(2),
                i = I(7),
                o = I(13);
              y(6),
                be("is-invalid", i.invalid && i.touched),
                v("ngModel", t.username),
                y(4),
                v("ngIf", i.invalid && i.touched),
                y(2),
                be("is-invalid", o.invalid && o.touched),
                v("ngModel", t.password),
                y(4),
                v("ngIf", o.invalid && o.touched),
                y(1),
                v("disabled", r.form.invalid),
                y(3),
                de(t.errorMSG);
            }
          },
          dependencies: [$e, zn, on, jt, Gn, an, Tn, Rt, sn],
          styles: ["form[_ngcontent-%COMP%]{max-width:300px}"],
        }));
      class ea {}
      (ea.ɵfac = function (e) {
        return new (e || ea)();
      }),
        (ea.ɵcmp = Ae({
          type: ea,
          selectors: [["app-page-not-found"]],
          decls: 12,
          vars: 0,
          consts: [
            [
              1,
              "d-flex",
              "align-items-center",
              "text-bg-secondary",
              2,
              "height",
              "85vh",
            ],
            [1, "container", "text-center"],
            [1, "display-1"],
            [1, "display-4"],
            [1, "lead"],
            ["routerLink", "/", 1, "btn", "btn-dark", "btn-lg"],
          ],
          template: function (e, t) {
            1 & e &&
              (h(0, "div", 0)(1, "div", 1)(2, "h1", 2),
              _(3, "Oops!"),
              f(),
              h(4, "h2", 3),
              _(5, "404 - Page Not Found"),
              f(),
              B(6, "br"),
              h(7, "p", 4),
              _(
                8,
                " The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. "
              ),
              f(),
              B(9, "br"),
              h(10, "a", 5),
              _(11, "Go back to home"),
              f()()());
          },
          dependencies: [ho],
        }));
      class qn {
        constructor(e) {
          (this.http = e),
            (this.REFRESH = new Nt()),
            (this.REFRESH$ = this.REFRESH.asObservable());
        }
        setREFRESH(e) {
          this.REFRESH.next(e);
        }
        getAllRevenues() {
          return this.http.get(`${ze}/revenues`).pipe(Ce((e) => Ie(() => e)));
        }
        addNewRevenue(e) {
          return this.http
            .post(`${ze}/revenues`, e)
            .pipe(Ce((t) => Ie(() => t)));
        }
        editRevenue(e, t) {
          return this.http
            .patch(`${ze}/revenues/${e}`, t)
            .pipe(Ce((r) => Ie(() => r)));
        }
        deleteRevenue(e) {
          return this.http
            .delete(`${ze}/revenues/${e}`)
            .pipe(Ce((t) => Ie(() => t)));
        }
      }
      function IV(n, e) {
        if ((1 & n && (h(0, "option", 22), _(1), f()), 2 & n)) {
          const t = e.$implicit;
          v("value", t), y(1), Fe(" ", t, " ");
        }
      }
      function AV(n, e) {
        1 & n && B(0, "div");
      }
      function xV(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 24)(1, "table", 25)(2, "thead")(3, "tr")(4, "th", 26),
            _(5, "Finance"),
            f(),
            h(6, "th", 27),
            _(7, "$"),
            f()()(),
            h(8, "tbody")(9, "tr")(10, "td", 28),
            _(11, "Revenues"),
            f(),
            h(12, "td"),
            _(13, " $ "),
            h(14, "span"),
            _(15),
            f()()(),
            h(16, "tr")(17, "td", 28),
            _(18, "Expences"),
            f(),
            h(19, "td"),
            _(20, " $ "),
            h(21, "span"),
            _(22),
            f()()(),
            h(23, "tr")(24, "td", 28),
            _(25, "Result"),
            f(),
            h(26, "td"),
            _(27, " $ "),
            h(28, "span"),
            _(29),
            f()()()()()()),
          2 & n)
        ) {
          const t = D(2);
          y(15),
            de(t.sumRevenues),
            y(7),
            de(t.sumExpences),
            y(7),
            de(t.sumRevenues - t.sumExpences);
        }
      }
      function RV(n, e) {
        1 & n && b(0, xV, 30, 3, "div", 23), 2 & n && v("ngIf", !D().loading);
      }
      function NV(n, e) {
        1 & n && B(0, "div");
      }
      function FV(n, e) {
        1 & n && (h(0, "h1"), _(1, "Loading ..."), f());
      }
      function PV(n, e) {
        if ((1 & n && (h(0, "h4", 32), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), de(t.errorMSG);
        }
      }
      function kV(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 29),
            b(1, NV, 1, 0, "div", 19),
            b(2, FV, 2, 0, "ng-template", null, 30, W),
            b(4, PV, 2, 1, "ng-template", null, 31, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D();
          y(1), v("ngIf", "" == i.errorMSG)("ngIfThen", t)("ngIfElse", r);
        }
      }
      (qn.ɵfac = function (e) {
        return new (e || qn)(N(go));
      }),
        (qn.ɵprov = O({ token: qn, factory: qn.ɵfac, providedIn: "root" }));
      class ta {
        constructor(e, t) {
          (this._revenuesService = e),
            (this._expencesService = t),
            (this.REVENUES = []),
            (this.EXPENCES = []),
            (this.filteredRevenues = []),
            (this.filteredExpences = []),
            (this.selectMonth = ""),
            (this.selectYear = ""),
            (this.dataFound = !1),
            (this.sumExpences = 0),
            (this.sumRevenues = 0),
            (this.monthName = [
              "allMonthes",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]),
            (this.yearRange = Array.from({ length: 54 }, (r, i) => 2022 + i)),
            (this.errorMSG = ""),
            (this.errorMSG2 = ""),
            (this.loading = !1);
        }
        ngOnInit() {
          (this.selectMonth = "999"),
            (this.selectYear = new Date().getFullYear().toString()),
            this.getAllRevenues();
        }
        filterData() {
          "999" !== this.selectMonth
            ? ((this.filteredRevenues = this.REVENUES.filter((e) =>
                e.date.startsWith(
                  this.formatDate(
                    parseInt(this.selectYear),
                    parseInt(this.selectMonth)
                  )
                )
              )),
              (this.filteredExpences = this.EXPENCES.filter((e) =>
                e.date.startsWith(
                  this.formatDate(
                    parseInt(this.selectYear),
                    parseInt(this.selectMonth)
                  )
                )
              )))
            : ((this.filteredRevenues = this.REVENUES.filter((e) =>
                e.date.startsWith(this.selectYear)
              )),
              (this.filteredExpences = this.EXPENCES.filter((e) =>
                e.date.startsWith(this.selectYear)
              ))),
            (this.sumRevenues = this.filteredRevenues.reduce(
              (e, t) => e + t.price,
              0
            )),
            (this.sumExpences = this.filteredExpences.reduce(
              (e, t) => e + t.price,
              0
            ));
        }
        formatDate(e, t) {
          return `${e}-${(t += 1) < 10 ? `0${t}` : String(t)}`;
        }
        getAllRevenues() {
          (this.errorMSG2 = ""),
            (this.loading = !0),
            this._revenuesService.getAllRevenues().subscribe({
              next: (e) => {
                (this.REVENUES = e.revenues),
                  (this.loading = !1),
                  (this.errorMSG2 = ""),
                  this.getAllExpences();
              },
              error: (e) => {
                (this.errorMSG = e.status),
                  (this.errorMSG2 = "Unexpected Error Occured"),
                  (this.errorMSG =
                    401 === e.status
                      ? "Unauthorized"
                      : 403 === e.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
        getAllExpences() {
          (this.errorMSG2 = ""),
            (this.loading = !0),
            this._expencesService.getAllExpences().subscribe({
              next: (e) => {
                (this.EXPENCES = e.expences),
                  (this.loading = !1),
                  (this.errorMSG2 = ""),
                  this.filterData();
              },
              error: (e) => {
                (this.errorMSG = e.status),
                  (this.errorMSG2 = "Unexpected Error Occured"),
                  (this.errorMSG =
                    401 === e.status
                      ? "Unauthorized"
                      : 403 === e.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
      }
      (ta.ɵfac = function (e) {
        return new (e || ta)(M(qn), M(jn));
      }),
        (ta.ɵcmp = Ae({
          type: ta,
          selectors: [["app-profits"]],
          decls: 37,
          vars: 6,
          consts: [
            [1, "mx-auto", "text-bg-dark", 2, "max-width", "600px"],
            [1, "text-bg-dark", "py-2"],
            [1, "d-flex", "selectflex"],
            [
              "name",
              "month",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            ["value", "999"],
            ["value", "0"],
            ["value", "1"],
            ["value", "2"],
            ["value", "3"],
            ["value", "4"],
            ["value", "5"],
            ["value", "6"],
            ["value", "7"],
            ["value", "8"],
            ["value", "9"],
            ["value", "10"],
            ["value", "11"],
            [
              "name",
              "year",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            [3, "value", 4, "ngFor", "ngForOf"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "value"],
            ["class", "table-responsive", 4, "ngIf"],
            [1, "table-responsive"],
            [1, "table", "table-bordered", "text-bg-dark"],
            [1, "col-8"],
            [1, "col-4"],
            ["scope", "row"],
            [1, "text-center", "text-bg-secondary"],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "select", 3),
                x("ngModelChange", function (i) {
                  return (t.selectMonth = i);
                })("change", function () {
                  return t.filterData();
                }),
                h(4, "option", 4),
                _(5, "All Months"),
                f(),
                h(6, "option", 5),
                _(7, "January"),
                f(),
                h(8, "option", 6),
                _(9, "February"),
                f(),
                h(10, "option", 7),
                _(11, "March"),
                f(),
                h(12, "option", 8),
                _(13, "April"),
                f(),
                h(14, "option", 9),
                _(15, "May"),
                f(),
                h(16, "option", 10),
                _(17, "June"),
                f(),
                h(18, "option", 11),
                _(19, "July"),
                f(),
                h(20, "option", 12),
                _(21, "August"),
                f(),
                h(22, "option", 13),
                _(23, "September"),
                f(),
                h(24, "option", 14),
                _(25, "October"),
                f(),
                h(26, "option", 15),
                _(27, "November"),
                f(),
                h(28, "option", 16),
                _(29, "December"),
                f()(),
                h(30, "select", 17),
                x("ngModelChange", function (i) {
                  return (t.selectYear = i);
                })("change", function () {
                  return t.filterData();
                }),
                b(31, IV, 2, 2, "option", 18),
                f()()(),
                b(32, AV, 1, 0, "div", 19),
                f(),
                b(33, RV, 1, 1, "ng-template", null, 20, W),
                b(35, kV, 6, 3, "ng-template", null, 21, W)),
              2 & e)
            ) {
              const r = I(34),
                i = I(36);
              y(3),
                v("ngModel", t.selectMonth),
                y(27),
                v("ngModel", t.selectYear),
                y(1),
                v("ngForOf", t.yearRange),
                y(1),
                v("ngIf", !t.loading)("ngIfThen", r)("ngIfElse", i);
            }
          },
          dependencies: [$n, $e, xu, Ru, vo, jt, Rt],
          styles: [
            ".selectflex[_ngcontent-%COMP%]{display:flex;justify-content:center}select[_ngcontent-%COMP%]{width:140px;height:35px;margin:0 10px}table[_ngcontent-%COMP%]{margin-bottom:0;margin-top:30px}",
          ],
        }));
      class Co {
        constructor() {
          (this.number = 0),
            (this.bookedDate = ""),
            (this.person = { name: "", contact: "" }),
            (this.modificationUser = ""),
            (this.notes = "");
        }
      }
      function OV(n, e) {
        1 & n && B(0, "div");
      }
      function LV(n, e) {}
      function VV(n, e) {
        1 & n && B(0, "div");
      }
      function $V(n, e) {
        1 & n && B(0, "div");
      }
      function UV(n, e) {
        1 & n && B(0, "div");
      }
      function BV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 12),
            x("click", function () {
              $(t);
              const i = D(4).$implicit,
                o = D().$implicit,
                s = D();
              return U(
                s.sendReservation(
                  s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
                )
              );
            }),
            _(1),
            f();
        }
        if (2 & n) {
          const t = D(4).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function jV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 13),
            x("click", function () {
              $(t);
              const i = D(4).$implicit,
                o = D().$implicit,
                s = D();
              return U(
                s.sendData(
                  s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
                )
              );
            }),
            _(1),
            f();
        }
        if (2 & n) {
          const t = D(4).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function HV(n, e) {
        if (
          (1 & n &&
            (b(0, UV, 1, 0, "div", 3),
            b(1, BV, 2, 1, "ng-template", null, 10, W),
            b(3, jV, 2, 1, "ng-template", null, 11, W)),
          2 & n)
        ) {
          const t = I(2),
            r = I(4),
            i = D(3).$implicit,
            o = D().$implicit,
            s = D();
          v(
            "ngIf",
            s.findReservation(
              s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
            )
          )("ngIfThen", t)("ngIfElse", r);
        }
      }
      function GV(n, e) {
        1 & n && B(0, "div");
      }
      function zV(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 12),
            x("click", function () {
              $(t);
              const i = D(4).$implicit,
                o = D().$implicit,
                s = D();
              return U(
                s.sendReservation(
                  s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
                )
              );
            }),
            _(1),
            f();
        }
        if (2 & n) {
          const t = D(4).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function qV(n, e) {
        if ((1 & n && (h(0, "button", 16), _(1), f()), 2 & n)) {
          const t = D(4).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function WV(n, e) {
        if (
          (1 & n &&
            (b(0, GV, 1, 0, "div", 3),
            b(1, zV, 2, 1, "ng-template", null, 14, W),
            b(3, qV, 2, 1, "ng-template", null, 15, W)),
          2 & n)
        ) {
          const t = I(2),
            r = I(4),
            i = D(3).$implicit,
            o = D().$implicit,
            s = D();
          v(
            "ngIf",
            s.findReservation(
              s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
            )
          )("ngIfThen", t)("ngIfElse", r);
        }
      }
      function KV(n, e) {
        if (
          (1 & n &&
            (b(0, $V, 1, 0, "div", 3),
            b(1, HV, 5, 3, "ng-template", null, 8, W),
            b(3, WV, 5, 3, "ng-template", null, 9, W)),
          2 & n)
        ) {
          const t = I(2),
            r = I(4),
            i = D(4);
          v("ngIf", i.roles.includes(5150) || i.roles.includes(2001))(
            "ngIfThen",
            t
          )("ngIfElse", r);
        }
      }
      function QV(n, e) {
        if (
          (1 & n &&
            (b(0, VV, 1, 0, "div", 6),
            b(1, KV, 5, 3, "ng-template", null, 7, W)),
          2 & n)
        ) {
          const t = I(2),
            r = D().$implicit,
            i = D().$implicit,
            o = D();
          v("ngIf", 7 * i + r - o.firstDay + 1 <= o.daysInMonth)("ngIfThen", t);
        }
      }
      function YV(n, e) {
        if (
          (1 & n &&
            (h(0, "td"),
            b(1, OV, 1, 0, "div", 3),
            b(2, LV, 0, 0, "ng-template", null, 4, W),
            b(4, QV, 3, 2, "ng-template", null, 5, W),
            f()),
          2 & n)
        ) {
          const t = e.$implicit,
            r = I(3),
            i = I(5),
            o = D().$implicit,
            s = D();
          y(1),
            v("ngIf", 0 === o && t < s.firstDay)("ngIfThen", r)("ngIfElse", i);
        }
      }
      function XV(n, e) {
        if ((1 & n && (h(0, "tr"), b(1, YV, 6, 3, "td", 2), f()), 2 & n)) {
          const t = D();
          y(1), v("ngForOf", t.jArr);
        }
      }
      class na {
        constructor(e) {
          (this._loginService = e),
            (this.sendModalData = new he()),
            (this.sendReservationData = new he()),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.bnumb = 0),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.iArr = [0, 1, 2, 3, 4, 5]),
            (this.jArr = [0, 1, 2, 3, 4, 5, 6]),
            (this.roles = []),
            (this.RESERVATIONS = []);
        }
        ngOnInit() {
          this.roles = this._loginService.haveAccess().UserInfo.roles;
        }
        findReservation(e) {
          return !!this.RESERVATIONS.filter(
            (r) => r.bookedDate == e && r.number == this.bnumb
          )[0];
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
        sendData(e) {
          this.sendModalData.emit({ date: e, bnumb: this.bnumb });
        }
        sendReservation(e) {
          let t = this.RESERVATIONS.find(
            (r) => r.bookedDate == e && r.number == this.bnumb
          );
          this.sendReservationData.emit(t);
        }
      }
      function ZV(n, e) {
        1 & n && (h(0, "small"), _(1, "username is too short"), f());
      }
      function JV(n, e) {
        if (
          (1 & n && (h(0, "div", 30), b(1, ZV, 2, 0, "small", 31), f()), 2 & n)
        ) {
          D();
          const t = I(15);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function e3(n, e) {
        1 & n && (h(0, "small"), _(1, "info is too short"), f());
      }
      function t3(n, e) {
        if (
          (1 & n && (h(0, "div", 30), b(1, e3, 2, 0, "small", 31), f()), 2 & n)
        ) {
          D();
          const t = I(21);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function n3(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function r3(n, e) {
        if (
          (1 & n && (h(0, "div", 30), b(1, n3, 2, 0, "small", 31), f()), 2 & n)
        ) {
          D();
          const t = I(33);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      (na.ɵfac = function (e) {
        return new (e || na)(M(mt));
      }),
        (na.ɵcmp = Ae({
          type: na,
          selectors: [["app-reservation-calendar"]],
          inputs: {
            month: "month",
            year: "year",
            bnumb: "bnumb",
            firstDay: "firstDay",
            daysInMonth: "daysInMonth",
            RESERVATIONS: "RESERVATIONS",
          },
          outputs: {
            sendModalData: "sendModalData",
            sendReservationData: "sendReservationData",
          },
          decls: 19,
          vars: 1,
          consts: [
            [1, "w-100", "p-1", "text-bg-dark"],
            [
              1,
              "text-center",
              "text-bg-secondary",
              "py-2",
              "w-auto",
              "border",
              "border-3",
              "border-dark",
              "rounded",
            ],
            [4, "ngFor", "ngForOf"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [4, "ngIf", "ngIfThen"],
            ["thenblock2", ""],
            ["thenblock3", ""],
            ["elseblock3", ""],
            ["thenblock10", ""],
            ["elseblock10", ""],
            [
              "data-bs-toggle",
              "modal",
              "data-bs-target",
              "#edit-reservation-modal",
              1,
              "btn",
              "btn-success",
              "w-100",
              3,
              "click",
            ],
            [
              "data-bs-toggle",
              "modal",
              "data-bs-target",
              "#add-reservation-modal",
              1,
              "btn",
              "btn-outline-secondary",
              "w-100",
              3,
              "click",
            ],
            ["thenblock11", ""],
            ["elseblock11", ""],
            ["disabled", "", 1, "btn", "btn-outline-secondary", "w-100"],
          ],
          template: function (e, t) {
            1 & e &&
              (h(0, "table", 0)(1, "thead")(2, "tr")(3, "th", 1),
              _(4, " Sun "),
              f(),
              h(5, "th", 1),
              _(6, " Mon "),
              f(),
              h(7, "th", 1),
              _(8, " Tue "),
              f(),
              h(9, "th", 1),
              _(10, " Wed "),
              f(),
              h(11, "th", 1),
              _(12, " Thu "),
              f(),
              h(13, "th", 1),
              _(14, " Fri "),
              f(),
              h(15, "th", 1),
              _(16, " Sat "),
              f()()(),
              h(17, "tbody"),
              b(18, XV, 2, 1, "tr", 2),
              f()()),
              2 & e && (y(18), v("ngForOf", t.iArr));
          },
          dependencies: [$n, $e],
        }));
      class ra {
        constructor(e, t) {
          (this._reservationService = e),
            (this._loginService = t),
            (this.date = ""),
            (this.bnumb = 0),
            (this.sendRefresh = new he()),
            (this.errorMSG = ""),
            (this.reservation = new Co());
        }
        ngOnInit() {
          (this.reservation.modificationUser =
            this._loginService.haveAccess().UserInfo.username),
            this._loginService.DATA$.subscribe(
              (e) => (this.reservation.modificationUser = e.username)
            );
        }
        refreshReservations() {
          this.sendRefresh.emit();
        }
        onSubmit(e) {
          (this.reservation.bookedDate = this.date),
            (this.reservation.number = this.bnumb),
            this._reservationService
              .addNewReservation(this.reservation)
              .subscribe({
                next: () => {
                  e.reset(),
                    (this.reservation = new Co()),
                    this.refreshReservations(),
                    this.closeModal();
                },
                error: (t) => {
                  401 === t.status && (this.errorMSG = "Unauthorized"),
                    403 === t.status && (this.errorMSG = "Forbiden"),
                    409 === t.status && (this.errorMSG = "Date already taken"),
                    setTimeout(() => {
                      (this.errorMSG = ""), this.closeModal();
                    }, 2e3);
                },
              });
        }
        clearModal(e) {
          e.reset();
        }
        closeModal() {
          let e = document.getElementById("add-reservation-close"),
            t = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !0,
            });
          e.dispatchEvent(t);
        }
      }
      function i3(n, e) {
        1 & n && (h(0, "small"), _(1, "Name is too short"), f());
      }
      function o3(n, e) {
        if (
          (1 & n && (h(0, "div", 27), b(1, i3, 2, 0, "small", 28), f()), 2 & n)
        ) {
          D();
          const t = I(15);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function s3(n, e) {
        1 & n && (h(0, "small"), _(1, "info is too short"), f());
      }
      function a3(n, e) {
        if (
          (1 & n && (h(0, "div", 27), b(1, s3, 2, 0, "small", 28), f()), 2 & n)
        ) {
          D();
          const t = I(2);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function l3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 10)(1, "input", 29, 30),
            x("ngModelChange", function (i) {
              return $(t), U((D().reservation.person.contact = i));
            }),
            f(),
            h(3, "label", 31),
            _(4, "Customer Contact Info"),
            f(),
            b(5, a3, 2, 1, "div", 14),
            f();
        }
        if (2 & n) {
          const t = I(2),
            r = D();
          y(1),
            be("is-invalid", t.invalid && t.touched),
            v("ngModel", r.reservation.person.contact),
            y(4),
            v("ngIf", t.invalid && t.touched);
        }
      }
      function u3(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function c3(n, e) {
        if (
          (1 & n && (h(0, "div", 27), b(1, u3, 2, 0, "small", 28), f()), 2 & n)
        ) {
          D();
          const t = I(28);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      function d3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 32)(1, "label", 33),
            _(2, "notes"),
            f(),
            h(3, "textarea", 34),
            x("ngModelChange", function (i) {
              return $(t), U((D().reservation.notes = i));
            }),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(3), v("ngModel", t.reservation.notes);
        }
      }
      function f3(n, e) {
        1 & n && (h(0, "button", 35), _(1, " Edit "), f()),
          2 & n && (D(), v("disabled", I(9).form.invalid));
      }
      function h3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 36),
            x("click", function () {
              return $(t), U(D().DeleteReservation());
            }),
            B(1, "i", 37),
            f();
        }
      }
      (ra.ɵfac = function (e) {
        return new (e || ra)(M(hr), M(mt));
      }),
        (ra.ɵcmp = Ae({
          type: ra,
          selectors: [["app-add-reservation"]],
          inputs: { date: "date", bnumb: "bnumb" },
          outputs: { sendRefresh: "sendRefresh" },
          decls: 46,
          vars: 17,
          consts: [
            [
              "id",
              "add-reservation-modal",
              "tabindex",
              "-1",
              "data-bs-backdrop",
              "static",
              "data-bs-keyboard",
              "false",
              "role",
              "dialog",
              "aria-labelledby",
              "add-reservation-modal-title",
              "aria-hidden",
              "true",
              1,
              "modal",
              "fade",
            ],
            [
              "role",
              "document",
              1,
              "modal-dialog",
              "modal-dialog-scrollable",
              "modal-dialog-centered",
              "modal-sm",
            ],
            [1, "modal-content", "bg-dark"],
            [1, "modal-header"],
            [1, "modal-title", "text-bg-dark"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "aria-label",
              "Close",
              1,
              "btn-close",
              3,
              "click",
            ],
            [1, "modal-body"],
            [
              "autocomplete",
              "off",
              "novalidate",
              "",
              1,
              "text-bg-secondary",
              "pt-3",
              "px-3",
              "rounded-4",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["ReservationForm", "ngForm"],
            ["ngModelGroup", "", "name", "person"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "name",
              "placeholder",
              "customer-info",
              "minlength",
              "3",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["CustomerName", "ngModel"],
            ["for", "add-reservation-name", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [
              "type",
              "text",
              "name",
              "contact",
              "placeholder",
              "customer-info",
              "minlength",
              "5",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["ContactInfo", "ngModel"],
            ["for", "add-reservation-contact", 1, "text-secondary"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "bookedDate",
              "required",
              "",
              "disabled",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "value",
            ],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Price", "ngModel"],
            [1, "mb-3"],
            ["for", "add-reservation-notes", 1, "form-label"],
            [
              "name",
              "notes",
              "rows",
              "1",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            [1, "text-danger", "text-center"],
            ["type", "submit", 1, "btn", "btn-dark", "mb-3", 3, "disabled"],
            [1, "modal-footer"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "id",
              "add-reservation-close",
              1,
              "btn",
              "btn-secondary",
              3,
              "click",
            ],
            [1, "text-danger"],
            [4, "ngIf"],
          ],
          template: function (e, t) {
            if (1 & e) {
              const r = se();
              h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h5", 4),
                _(5, "Add Reservation"),
                f(),
                h(6, "button", 5),
                x("click", function () {
                  $(r);
                  const o = I(9);
                  return U(t.clearModal(o));
                }),
                f()(),
                h(7, "div", 6)(8, "form", 7, 8),
                x("ngSubmit", function () {
                  $(r);
                  const o = I(9);
                  return U(t.onSubmit(o));
                }),
                h(10, "p"),
                _(11),
                f(),
                h(12, "div", 9)(13, "div", 10)(14, "input", 11, 12),
                x("ngModelChange", function (o) {
                  return (t.reservation.person.name = o);
                }),
                f(),
                h(16, "label", 13),
                _(17, "Customer Name"),
                f(),
                b(18, JV, 2, 1, "div", 14),
                f(),
                h(19, "div", 10)(20, "input", 15, 16),
                x("ngModelChange", function (o) {
                  return (t.reservation.person.contact = o);
                }),
                f(),
                h(22, "label", 17),
                _(23, "Customer Contact Info"),
                f(),
                b(24, t3, 2, 1, "div", 14),
                f()(),
                h(25, "div", 18)(26, "div", 19),
                _(27, "Date:"),
                f(),
                B(28, "input", 20),
                f(),
                h(29, "div", 18)(30, "div", 19),
                _(31, "$"),
                f(),
                h(32, "input", 21, 22),
                x("ngModelChange", function (o) {
                  return (t.reservation.price = o);
                }),
                f()(),
                b(34, r3, 2, 1, "div", 14),
                h(35, "div", 23)(36, "label", 24),
                _(37, "notes"),
                f(),
                h(38, "textarea", 25),
                x("ngModelChange", function (o) {
                  return (t.reservation.notes = o);
                }),
                f()(),
                h(39, "div", 26),
                _(40),
                f(),
                h(41, "button", 27),
                _(42, " Save "),
                f()()(),
                h(43, "div", 28)(44, "button", 29),
                x("click", function () {
                  $(r);
                  const o = I(9);
                  return U(t.clearModal(o));
                }),
                _(45, " Close "),
                f()()()()();
            }
            if (2 & e) {
              const r = I(9),
                i = I(15),
                o = I(21),
                s = I(33);
              y(11),
                Fe("Bungalow : ", t.bnumb, ""),
                y(3),
                be("is-invalid", i.invalid && i.touched),
                v("ngModel", t.reservation.person.name),
                y(4),
                v("ngIf", i.invalid && i.touched),
                y(2),
                be("is-invalid", o.invalid && o.touched),
                v("ngModel", t.reservation.person.contact),
                y(4),
                v("ngIf", o.invalid && o.touched),
                y(4),
                v("value", t.date),
                y(4),
                be("is-invalid", s.invalid && s.touched),
                v("ngModel", t.reservation.price),
                y(2),
                v("ngIf", s.invalid && s.touched),
                y(4),
                v("ngModel", t.reservation.notes),
                y(2),
                de(t.errorMSG),
                y(1),
                v("disabled", r.form.invalid);
            }
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, di, kr, Rt, yo, sn],
        }));
      class ia {
        constructor(e, t) {
          (this._reservationService = e),
            (this._loginService = t),
            (this.Refresh = new he()),
            (this.reservation = new Co()),
            (this.errorMSG = ""),
            (this.roles = []);
        }
        ngOnInit() {
          this.roles = this._loginService.haveAccess().UserInfo.roles;
        }
        sendRefreshReq() {
          this.Refresh.emit();
        }
        onSubmit(e) {
          this._reservationService
            .editReservation(
              this.reservation.number,
              this.reservation.bookedDate,
              this.reservation
            )
            .subscribe({
              next: () => {
                e.reset(),
                  (this.reservation = new Co()),
                  this.sendRefreshReq(),
                  this.closeModal();
              },
              error: (t) => {
                401 === t.status && (this.errorMSG = "Unauthorized"),
                  403 === t.status && (this.errorMSG = "Forbiden"),
                  409 === t.status && (this.errorMSG = "Date already taken"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 2e3);
              },
            });
        }
        DeleteReservation() {
          1 == window.confirm("Confirm delete") &&
            this._reservationService
              .deleteReservation(
                this.reservation.number,
                this.reservation.bookedDate
              )
              .subscribe({
                next: () => {
                  (this.reservation = new Co()),
                    this.sendRefreshReq(),
                    this.closeModal();
                },
                error: (t) => {
                  401 === t.status && (this.errorMSG = "Unauthorized"),
                    403 === t.status && (this.errorMSG = "Forbiden"),
                    setTimeout(() => {
                      this.errorMSG = "";
                    }, 2e3);
                },
              });
        }
        closeModal() {
          let e = document.getElementById("edit-reservation-close"),
            t = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !0,
            });
          e.dispatchEvent(t);
        }
      }
      function p3(n, e) {
        1 & n && B(0, "div");
      }
      function g3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "section", 5)(1, "div", 6)(2, "button", 7),
            x("click", function () {
              return $(t), U(D().prev());
            }),
            _(3, "<<"),
            f(),
            h(4, "span"),
            _(5),
            f(),
            h(6, "button", 7),
            x("click", function () {
              return $(t), U(D().next());
            }),
            _(7, ">>"),
            f()(),
            h(8, "div", 8),
            _(9),
            f(),
            h(10, "div", 9),
            _(11, " Bungalow 1 "),
            f(),
            h(12, "app-reservation-calendar", 10),
            x("sendModalData", function (i) {
              return $(t), U(D().modalPropertySetter(i));
            })("sendReservationData", function (i) {
              return $(t), U(D().handleEditModal(i));
            }),
            f(),
            h(13, "div", 11),
            _(14, " Bungalow 2 "),
            f(),
            h(15, "app-reservation-calendar", 10),
            x("sendModalData", function (i) {
              return $(t), U(D().modalPropertySetter(i));
            })("sendReservationData", function (i) {
              return $(t), U(D().handleEditModal(i));
            }),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(5),
            de(t.currentDate),
            y(4),
            de(t.errorMSG),
            y(3),
            v("month", t.month)("year", t.year)("bnumb", 1)(
              "daysInMonth",
              t.sendCalendarData().daysInMonth
            )("firstDay", t.sendCalendarData().firstDay)(
              "RESERVATIONS",
              t.RESERVATIONS
            ),
            y(3),
            v("month", t.month)("year", t.year)("bnumb", 2)(
              "daysInMonth",
              t.sendCalendarData().daysInMonth
            )("firstDay", t.sendCalendarData().firstDay)(
              "RESERVATIONS",
              t.RESERVATIONS
            );
        }
      }
      function m3(n, e) {
        1 & n && B(0, "div");
      }
      function _3(n, e) {
        1 & n && (h(0, "h1"), _(1, "Loading ..."), f());
      }
      function y3(n, e) {
        if ((1 & n && (h(0, "h4", 15), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), de(t.errorMSG2);
        }
      }
      function v3(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 12),
            b(1, m3, 1, 0, "div", 0),
            b(2, _3, 2, 0, "ng-template", null, 13, W),
            b(4, y3, 2, 1, "ng-template", null, 14, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D();
          y(1), v("ngIf", "" == i.errorMSG2)("ngIfThen", t)("ngIfElse", r);
        }
      }
      (ia.ɵfac = function (e) {
        return new (e || ia)(M(hr), M(mt));
      }),
        (ia.ɵcmp = Ae({
          type: ia,
          selectors: [["app-edit-reservation"]],
          inputs: { reservation: "reservation" },
          outputs: { Refresh: "Refresh" },
          decls: 38,
          vars: 17,
          consts: [
            [
              "id",
              "edit-reservation-modal",
              "tabindex",
              "-1",
              "data-bs-backdrop",
              "static",
              "data-bs-keyboard",
              "false",
              "role",
              "dialog",
              "aria-labelledby",
              "edit-reservation-modal-title",
              "aria-hidden",
              "true",
              1,
              "modal",
              "fade",
            ],
            [
              "role",
              "document",
              1,
              "modal-dialog",
              "modal-dialog-scrollable",
              "modal-dialog-centered",
              "modal-sm",
            ],
            [1, "modal-content", "bg-dark"],
            [1, "modal-header"],
            [1, "modal-title", "text-bg-dark"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "aria-label",
              "Close",
              1,
              "btn-close",
            ],
            [1, "modal-body"],
            [
              "autocomplete",
              "off",
              "novalidate",
              "",
              1,
              "text-bg-secondary",
              "pt-3",
              "px-3",
              "rounded-4",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["editReservationForm", "ngForm"],
            ["ngModelGroup", "", "name", "person"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "name",
              "placeholder",
              "customer-info",
              "minlength",
              "3",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "disabled",
              "ngModel",
              "ngModelChange",
            ],
            ["CustomerName", "ngModel"],
            ["for", "edit-reservation-name", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            ["class", "form-floating mb-3", 4, "ngIf"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "bookedDate",
              "required",
              "",
              "disabled",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "value",
            ],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "disabled",
              "ngModel",
              "ngModelChange",
            ],
            ["Price", "ngModel"],
            ["class", "mb-3", 4, "ngIf"],
            [1, "text-danger", "text-center"],
            [
              "type",
              "submit",
              "class",
              "btn btn-dark mb-3",
              3,
              "disabled",
              4,
              "ngIf",
            ],
            [1, "modal-footer"],
            ["class", "btn btn-sm btn-outline-danger", 3, "click", 4, "ngIf"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "id",
              "edit-reservation-close",
              1,
              "btn",
              "btn-secondary",
            ],
            [1, "text-danger"],
            [4, "ngIf"],
            [
              "type",
              "text",
              "name",
              "contact",
              "placeholder",
              "customer-info",
              "minlength",
              "5",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["ContactInfo", "ngModel"],
            ["for", "edit-reservation-contact", 1, "text-secondary"],
            [1, "mb-3"],
            ["for", "edit-reservation-notes", 1, "form-label"],
            [
              "name",
              "notes",
              "rows",
              "1",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["type", "submit", 1, "btn", "btn-dark", "mb-3", 3, "disabled"],
            [1, "btn", "btn-sm", "btn-outline-danger", 3, "click"],
            [1, "fas", "fa-trash"],
          ],
          template: function (e, t) {
            if (1 & e) {
              const r = se();
              h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h5", 4),
                _(5, "Reservation"),
                f(),
                B(6, "button", 5),
                f(),
                h(7, "div", 6)(8, "form", 7, 8),
                x("ngSubmit", function () {
                  $(r);
                  const o = I(9);
                  return U(t.onSubmit(o));
                }),
                h(10, "p"),
                _(11),
                f(),
                h(12, "div", 9)(13, "div", 10)(14, "input", 11, 12),
                x("ngModelChange", function (o) {
                  return (t.reservation.person.name = o);
                }),
                f(),
                h(16, "label", 13),
                _(17, "Customer Name"),
                f(),
                b(18, o3, 2, 1, "div", 14),
                f(),
                b(19, l3, 6, 4, "div", 15),
                f(),
                h(20, "div", 16)(21, "div", 17),
                _(22, "Date:"),
                f(),
                B(23, "input", 18),
                f(),
                h(24, "div", 16)(25, "div", 17),
                _(26, "$"),
                f(),
                h(27, "input", 19, 20),
                x("ngModelChange", function (o) {
                  return (t.reservation.price = o);
                }),
                f()(),
                b(29, c3, 2, 1, "div", 14),
                b(30, d3, 4, 1, "div", 21),
                h(31, "div", 22),
                _(32),
                f(),
                b(33, f3, 2, 1, "button", 23),
                f()(),
                h(34, "div", 24),
                b(35, h3, 2, 0, "button", 25),
                h(36, "button", 26),
                _(37, " Close "),
                f()()()()();
            }
            if (2 & e) {
              const r = I(15),
                i = I(28);
              y(11),
                Fe("Bungalow : ", t.reservation.number, ""),
                y(3),
                be("is-invalid", r.invalid && r.touched),
                v(
                  "disabled",
                  !t.roles.includes(5150) || !t.roles.includes(2001)
                )("ngModel", t.reservation.person.name),
                y(4),
                v("ngIf", r.invalid && r.touched),
                y(1),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001)),
                y(4),
                v("value", t.reservation.bookedDate),
                y(4),
                be("is-invalid", i.invalid && i.touched),
                v(
                  "disabled",
                  !t.roles.includes(5150) || !t.roles.includes(2001)
                )("ngModel", t.reservation.price),
                y(2),
                v("ngIf", i.invalid && i.touched),
                y(1),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001)),
                y(2),
                de(t.errorMSG),
                y(1),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001)),
                y(2),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001));
            }
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, di, kr, Rt, yo, sn],
        }));
      class oa {
        constructor(e) {
          (this._resevationService = e),
            (this.loading = !0),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.currentDate = ""),
            (this.RESERVATIONS = []),
            (this.dateForModal = ""),
            (this.bNumbForModal = 0),
            (this.selectedReservation = new Co()),
            (this.errorMSG = ""),
            (this.errorMSG2 = ""),
            (this.monthName = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]);
        }
        ngOnInit() {
          this.getAllReservations(), this.setCurrentDate();
        }
        sendCalendarData() {
          return {
            firstDay: new Date(this.year, this.month).getDay(),
            daysInMonth: 32 - new Date(this.year, this.month, 32).getDate(),
          };
        }
        modalPropertySetter(e) {
          (this.dateForModal = e.date), (this.bNumbForModal = e.bnumb);
        }
        prev() {
          this.month--,
            this.month < 0 && ((this.month = 11), this.year--),
            this.setCurrentDate();
        }
        next() {
          this.month++,
            this.month > 11 && ((this.month = 0), this.year++),
            this.setCurrentDate();
        }
        setCurrentDate() {
          this.currentDate = `${this.monthName[this.month]} ${this.year}`;
        }
        handleModals(e) {
          this.getAllReservations();
        }
        handleEditModal(e) {
          this.selectedReservation = e;
        }
        getAllReservations() {
          (this.errorMSG2 = ""),
            (this.loading = !0),
            this._resevationService.getAllReservations().subscribe({
              next: (e) => {
                (this.RESERVATIONS = e.reservations),
                  (this.loading = !1),
                  (this.errorMSG2 = "");
              },
              error: (e) => {
                (this.errorMSG = e.status),
                  (this.errorMSG2 = "Unexpected Error Occured"),
                  401 === e.status && (this.errorMSG = "Unauthorized"),
                  403 === e.status && (this.errorMSG = "Forbiden"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 2e3);
              },
            });
        }
      }
      (oa.ɵfac = function (e) {
        return new (e || oa)(M(hr));
      }),
        (oa.ɵcmp = Ae({
          type: oa,
          selectors: [["app-all-reservations"]],
          decls: 7,
          vars: 6,
          consts: [
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "bnumb", "date", "sendRefresh"],
            [3, "reservation", "Refresh"],
            [
              "id",
              "reservations-section",
              1,
              "text-bg-secondary",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            [
              1,
              "d-flex",
              "justify-content-around",
              "align-items-center",
              "p-2",
              "text-bg-dark",
              "border-bottom",
              "border-secondary",
            ],
            [1, "btn", "btn-secondary", 3, "click"],
            [1, "text-danger", "text-center"],
            [
              1,
              "d-flex",
              "justify-content-center",
              "align-items-center",
              "p-2",
              "text-bg-dark",
            ],
            [
              3,
              "month",
              "year",
              "bnumb",
              "daysInMonth",
              "firstDay",
              "RESERVATIONS",
              "sendModalData",
              "sendReservationData",
            ],
            [
              1,
              "d-flex",
              "justify-content-center",
              "align-items-center",
              "p-2",
              "text-bg-dark",
              "mt-3",
            ],
            [1, "text-center", "text-bg-secondary"],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (b(0, p3, 1, 0, "div", 0),
                b(1, g3, 16, 14, "ng-template", null, 1, W),
                b(3, v3, 6, 3, "ng-template", null, 2, W),
                h(5, "app-add-reservation", 3),
                x("sendRefresh", function (i) {
                  return t.handleModals(i);
                }),
                f(),
                h(6, "app-edit-reservation", 4),
                x("Refresh", function (i) {
                  return t.handleModals(i);
                }),
                f()),
              2 & e)
            ) {
              const r = I(2),
                i = I(4);
              v("ngIf", !t.loading)("ngIfThen", r)("ngIfElse", i),
                y(5),
                v("bnumb", t.bNumbForModal)("date", t.dateForModal),
                y(1),
                v("reservation", t.selectedReservation);
            }
          },
          dependencies: [$e, na, ra, ia],
        }));
      class Nu {
        constructor() {
          (this.title = ""), (this.date = "");
        }
      }
      function C3(n, e) {
        1 & n && B(0, "div");
      }
      function D3(n, e) {}
      function b3(n, e) {
        1 & n && B(0, "div");
      }
      function E3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "button", 9),
            x("click", function () {
              $(t);
              const i = D(3).$implicit,
                o = D().$implicit,
                s = D();
              return U(s.sendData(7 * o + i - s.firstDay + 1, s.month));
            }),
            _(1),
            f();
        }
        if (2 & n) {
          const t = D(3).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function w3(n, e) {
        if ((1 & n && (h(0, "button", 10), _(1), f()), 2 & n)) {
          const t = D(3).$implicit,
            r = D().$implicit,
            i = D();
          y(1), Fe(" ", 7 * r + t - i.firstDay + 1, " ");
        }
      }
      function S3(n, e) {
        if (
          (1 & n &&
            (h(0, "div"),
            b(1, b3, 1, 0, "div", 3),
            b(2, E3, 2, 1, "ng-template", null, 7, W),
            b(4, w3, 2, 1, "ng-template", null, 8, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D(2).$implicit,
            o = D().$implicit,
            s = D();
          y(1),
            v(
              "ngIf",
              s.findReservation(
                s.formatDate(7 * o + i - s.firstDay + 1, s.year, s.month)
              )
            )("ngIfThen", t)("ngIfElse", r);
        }
      }
      function M3(n, e) {
        if ((1 & n && b(0, S3, 6, 3, "div", 6), 2 & n)) {
          const t = D().$implicit,
            r = D().$implicit,
            i = D();
          v("ngIf", 7 * r + t - i.firstDay + 1 <= i.daysInMonth);
        }
      }
      function T3(n, e) {
        if (
          (1 & n &&
            (h(0, "td"),
            b(1, C3, 1, 0, "div", 3),
            b(2, D3, 0, 0, "ng-template", null, 4, W),
            b(4, M3, 1, 1, "ng-template", null, 5, W),
            f()),
          2 & n)
        ) {
          const t = e.$implicit,
            r = I(3),
            i = I(5),
            o = D().$implicit,
            s = D();
          y(1),
            v("ngIf", 0 === o && t < s.firstDay)("ngIfThen", r)("ngIfElse", i);
        }
      }
      function I3(n, e) {
        if ((1 & n && (h(0, "tr"), b(1, T3, 6, 3, "td", 2), f()), 2 & n)) {
          const t = D();
          y(1), v("ngForOf", t.jArr);
        }
      }
      class sa {
        constructor() {
          (this.sendDate = new he()),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.REVENUES = []),
            (this.iArr = [0, 1, 2, 3, 4, 5]),
            (this.jArr = [0, 1, 2, 3, 4, 5, 6]);
        }
        findReservation(e) {
          return !!this.REVENUES.filter((r) => r.date == e)[0];
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
        sendData(e, t) {
          this.sendDate.emit({ day: e, month: t });
        }
      }
      function A3(n, e) {
        if ((1 & n && (h(0, "option", 8), _(1), f()), 2 & n)) {
          const t = e.$implicit;
          v("value", e.index), y(1), Fe(" ", t, " ");
        }
      }
      function x3(n, e) {
        if ((1 & n && (h(0, "option", 8), _(1), f()), 2 & n)) {
          const t = e.$implicit;
          v("value", t), y(1), Fe(" ", t, " ");
        }
      }
      function R3(n, e) {
        1 & n && B(0, "div");
      }
      function N3(n, e) {
        if (
          (1 & n &&
            (h(0, "tr")(1, "td", 15),
            _(2),
            f(),
            h(3, "td"),
            _(4),
            f(),
            h(5, "td"),
            _(6),
            f()()),
          2 & n)
        ) {
          const t = e.$implicit;
          y(2),
            de(t.title),
            y(2),
            wr("", t.date[8], "", t.date[9], ""),
            y(2),
            de(t.price);
        }
      }
      function F3(n, e) {
        if (
          (1 & n &&
            (h(0, "section", 9)(1, "div", 10),
            _(2, "Total"),
            f(),
            h(3, "div"),
            _(4),
            f()(),
            h(5, "table", 11)(6, "thead")(7, "tr")(8, "th", 12),
            _(9, "Revenue"),
            f(),
            h(10, "th", 13),
            _(11, "Day"),
            f(),
            h(12, "th", 13),
            _(13, "$"),
            f()()(),
            h(14, "tbody"),
            b(15, N3, 7, 4, "tr", 14),
            f()()),
          2 & n)
        ) {
          const t = D();
          y(4),
            Fe("", t.total(), " $"),
            y(11),
            v("ngForOf", t.filteredRevenues);
        }
      }
      function P3(n, e) {
        if ((1 & n && (h(0, "h2", 16), _(1), f()), 2 & n)) {
          const t = D();
          y(1),
            wr(
              " No Revenues Found in ",
              t.getMonthName(t.selectMonth),
              " ",
              t.selectYear,
              " "
            );
        }
      }
      (sa.ɵfac = function (e) {
        return new (e || sa)();
      }),
        (sa.ɵcmp = Ae({
          type: sa,
          selectors: [["app-revenues-calendar"]],
          inputs: {
            month: "month",
            year: "year",
            firstDay: "firstDay",
            daysInMonth: "daysInMonth",
            REVENUES: "REVENUES",
          },
          outputs: { sendDate: "sendDate" },
          decls: 19,
          vars: 1,
          consts: [
            [1, "w-100", "p-1", "text-bg-dark"],
            [
              1,
              "text-center",
              "text-bg-secondary",
              "py-2",
              "w-auto",
              "border",
              "border-3",
              "border-dark",
              "rounded",
            ],
            [4, "ngFor", "ngForOf"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [4, "ngIf"],
            ["thenblock10", ""],
            ["elseblock10", ""],
            [1, "btn", "btn-success", "w-100", 3, "click"],
            ["disabled", "", 1, "btn", "btn-outline-secondary", "w-100"],
          ],
          template: function (e, t) {
            1 & e &&
              (h(0, "table", 0)(1, "thead")(2, "tr")(3, "th", 1),
              _(4, " Sun "),
              f(),
              h(5, "th", 1),
              _(6, " Mon "),
              f(),
              h(7, "th", 1),
              _(8, " Tue "),
              f(),
              h(9, "th", 1),
              _(10, " Wed "),
              f(),
              h(11, "th", 1),
              _(12, " Thu "),
              f(),
              h(13, "th", 1),
              _(14, " Fri "),
              f(),
              h(15, "th", 1),
              _(16, " Sat "),
              f()()(),
              h(17, "tbody"),
              b(18, I3, 2, 1, "tr", 2),
              f()()),
              2 & e && (y(18), v("ngForOf", t.iArr));
          },
          dependencies: [$n, $e],
        }));
      class aa {
        constructor(e) {
          (this._revenuesService = e),
            (this.REVENUES = []),
            (this.filteredRevenues = []),
            (this.selectMonth = ""),
            (this.selectYear = ""),
            (this.dataFound = !1),
            (this.monthName = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]),
            (this.yearRange = Array.from({ length: 54 }, (t, r) => 2022 + r));
        }
        ngOnInit() {
          this._revenuesService.REFRESH$.subscribe(() => {
            this.filterData();
          }),
            (this.selectMonth = new Date().getMonth().toString()),
            (this.selectYear = new Date().getFullYear().toString());
        }
        filterData() {
          (this.filteredRevenues = this.REVENUES.filter((e) =>
            e.date.startsWith(
              this.formatDate(
                parseInt(this.selectYear),
                parseInt(this.selectMonth)
              )
            )
          )),
            (this.filteredRevenues = this.sortByDate(this.filteredRevenues)),
            (this.dataFound = 0 != this.filteredRevenues.length);
        }
        formatDate(e, t) {
          return `${e}-${(t += 1) < 10 ? `0${t}` : String(t)}`;
        }
        getMonthName(e) {
          return this.monthName[parseInt(e)];
        }
        total() {
          return this.filteredRevenues.reduce((e, t) => e + t.price, 0);
        }
        sortByDate(e) {
          return e.sort(
            (t, r) => new Date(r.date).getTime() - new Date(t.date).getTime()
          );
        }
      }
      function k3(n, e) {
        if ((1 & n && (h(0, "h3", 17), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), Fe(" ", t.errorMSG, " ");
        }
      }
      function O3(n, e) {
        1 & n && (h(0, "small"), _(1, " it's too short"), f());
      }
      function L3(n, e) {
        if (
          (1 & n && (h(0, "div", 18), b(1, O3, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(8);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function V3(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function $3(n, e) {
        if (
          (1 & n && (h(0, "div", 18), b(1, V3, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(21);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      function U3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div")(1, "form", 1, 2),
            x("ngSubmit", function () {
              $(t);
              const i = I(2);
              return U(D().addRevenue(i));
            }),
            h(3, "h1", 3),
            _(4, "Add Revenue"),
            f(),
            b(5, k3, 2, 1, "h3", 4),
            h(6, "div", 5)(7, "input", 6, 7),
            x("ngModelChange", function (i) {
              return $(t), U((D().revenue.title = i));
            }),
            f(),
            h(9, "label", 8),
            _(10, "Revenue"),
            f(),
            b(11, L3, 2, 1, "div", 9),
            f(),
            h(12, "div", 10)(13, "div", 11),
            _(14, "Date:"),
            f(),
            h(15, "input", 12, 13),
            x("ngModelChange", function (i) {
              return $(t), U((D().revenue.date = i));
            }),
            f()(),
            h(17, "div", 10)(18, "div", 11),
            _(19, "$"),
            f(),
            h(20, "input", 14, 15),
            x("ngModelChange", function (i) {
              return $(t), U((D().revenue.price = i));
            }),
            f()(),
            b(22, $3, 2, 1, "div", 9),
            h(23, "button", 16),
            _(24, " Submit "),
            f()()();
        }
        if (2 & n) {
          const t = I(2),
            r = I(8),
            i = I(16),
            o = I(21),
            s = D();
          y(5),
            v("ngIf", "" != s.errorMSG),
            y(2),
            be("is-invalid", r.invalid && r.touched),
            v("ngModel", s.revenue.title),
            y(4),
            v("ngIf", r.invalid && r.touched),
            y(4),
            be("is-invalid", i.invalid && i.touched),
            v("ngModel", s.revenue.date),
            y(5),
            be("is-invalid", o.invalid && o.touched),
            v("ngModel", s.revenue.price),
            y(2),
            v("ngIf", o.invalid && o.touched),
            y(1),
            v("disabled", t.form.invalid || !0 === s.loading);
        }
      }
      (aa.ɵfac = function (e) {
        return new (e || aa)(M(qn));
      }),
        (aa.ɵcmp = Ae({
          type: aa,
          selectors: [["app-monthly-revenues"]],
          inputs: { REVENUES: "REVENUES" },
          decls: 11,
          vars: 7,
          consts: [
            [1, "text-bg-dark", "py-2"],
            [1, "d-flex", "selectflex"],
            [
              "name",
              "month",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            [3, "value", 4, "ngFor", "ngForOf"],
            [
              "name",
              "year",
              1,
              "text-bg-secondary",
              "rounded",
              3,
              "ngModel",
              "ngModelChange",
              "change",
            ],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "value"],
            [1, "text-bg-dark", "border"],
            [1, "ps-3", "text-start", "bold"],
            [1, "table", "table-dark", "table-striped", "text-center"],
            ["scope", "col", 1, "col", "text-start"],
            ["scope", "col", 1, "col-1"],
            [4, "ngFor", "ngForOf"],
            [1, "text-start"],
            [1, "text-center", "text-bg-dark", "py-5", "border"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "div", 0)(1, "div", 1)(2, "select", 2),
                x("ngModelChange", function (i) {
                  return (t.selectMonth = i);
                })("change", function () {
                  return t.filterData();
                }),
                b(3, A3, 2, 2, "option", 3),
                f(),
                h(4, "select", 4),
                x("ngModelChange", function (i) {
                  return (t.selectYear = i);
                })("change", function () {
                  return t.filterData();
                }),
                b(5, x3, 2, 2, "option", 3),
                f()()(),
                b(6, R3, 1, 0, "div", 5),
                b(7, F3, 16, 2, "ng-template", null, 6, W),
                b(9, P3, 2, 2, "ng-template", null, 7, W)),
              2 & e)
            ) {
              const r = I(8),
                i = I(10);
              y(2),
                v("ngModel", t.selectMonth),
                y(1),
                v("ngForOf", t.monthName),
                y(1),
                v("ngModel", t.selectYear),
                y(1),
                v("ngForOf", t.yearRange),
                y(1),
                v("ngIf", t.dataFound)("ngIfThen", r)("ngIfElse", i);
            }
          },
          dependencies: [$n, $e, xu, Ru, vo, jt, Rt],
          styles: [
            ".selectflex[_ngcontent-%COMP%]{display:flex;justify-content:center}select[_ngcontent-%COMP%]{width:140px;height:35px;margin:0 10px}section[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 90px;padding:10px 0}.bold[_ngcontent-%COMP%]{font-weight:bolder}",
          ],
        }));
      class la {
        constructor(e) {
          (this._revenuesService = e),
            (this.sendRefreshReq = new he()),
            (this.date = new Date()),
            (this.revenue = new Nu()),
            (this.errorMSG = ""),
            (this.refresh = !1),
            (this.loading = !1);
        }
        ngOnInit() {
          this._revenuesService.REFRESH$.subscribe((e) => {
            (this.refresh = e),
              (this.revenue = new Nu()),
              (this.revenue.date = this.formatDate(
                this.date.getDate(),
                this.date.getFullYear(),
                this.date.getMonth()
              ));
          });
        }
        addRevenue(e) {
          (this.loading = !0),
            this._revenuesService.addNewRevenue(this.revenue).subscribe({
              next: () => {
                e.reset(), (this.loading = !1), this.sendRefreshReq.emit();
              },
              error: (t) => {
                (this.loading = !1),
                  (this.errorMSG = t.status),
                  (this.errorMSG =
                    401 === t.status
                      ? "Unauthorized"
                      : 403 === t.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
      }
      function B3(n, e) {
        1 & n && (h(0, "small"), _(1, "it's too short"), f());
      }
      function j3(n, e) {
        if (
          (1 & n && (h(0, "div", 26), b(1, B3, 2, 0, "small", 27), f()), 2 & n)
        ) {
          D();
          const t = I(13);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function H3(n, e) {
        1 & n && (h(0, "small"), _(1, "Price must be Positive"), f());
      }
      function G3(n, e) {
        if (
          (1 & n && (h(0, "div", 26), b(1, H3, 2, 0, "small", 27), f()), 2 & n)
        ) {
          D();
          const t = I(26);
          y(1), v("ngIf", null == t.errors ? null : t.errors.pattern);
        }
      }
      function z3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 28)(1, "label", 29),
            _(2, "notes"),
            f(),
            h(3, "textarea", 30),
            x("ngModelChange", function (i) {
              return $(t), U((D().revenue.notes = i));
            }),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(3), v("ngModel", t.revenue.notes);
        }
      }
      (la.ɵfac = function (e) {
        return new (e || la)(M(qn));
      }),
        (la.ɵcmp = Ae({
          type: la,
          selectors: [["app-add-revenue"]],
          outputs: { sendRefreshReq: "sendRefreshReq" },
          decls: 1,
          vars: 1,
          consts: [
            [4, "ngIf"],
            [
              "autocomplete",
              "off",
              1,
              "text-bg-dark",
              "pt-3",
              "px-3",
              "rounded-bottom",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["addRevenueForm", "ngForm"],
            [1, "py-3", "text-center"],
            ["class", "text-center text-danger", 4, "ngIf"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "revenue-title",
              "placeholder",
              "revenue-title",
              "minlength",
              "3",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["revenueTitle", "ngModel"],
            ["for", "add-revenue-title", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "date",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["revenueDate", "ngModel"],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["revenuePrice", "ngModel"],
            [
              "type",
              "submit",
              1,
              "btn",
              "btn-secondary",
              "my-5",
              3,
              "disabled",
            ],
            [1, "text-center", "text-danger"],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            1 & e && b(0, U3, 25, 13, "div", 0),
              2 & e && v("ngIf", !1 === t.refresh);
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, kr, Rt, sn],
        }));
      class ua {
        constructor(e, t) {
          (this._revenuesService = e),
            (this._loginService = t),
            (this.Refresh = new he()),
            (this.revenue = new Nu()),
            (this.errorMSG = ""),
            (this.roles = []);
        }
        ngOnInit() {
          this.roles = this._loginService.haveAccess().UserInfo.roles;
        }
        sendRefreshReq() {
          this.Refresh.emit();
        }
        onSubmit(e) {
          this._revenuesService
            .editRevenue(this.revenue._id, this.revenue)
            .subscribe({
              next: () => {
                this.sendRefreshReq(), e.reset(), this.closeModal();
              },
              error: (t) => {
                401 === t.status && (this.errorMSG = "Unauthorized"),
                  403 === t.status && (this.errorMSG = "Forbiden"),
                  404 === t.status && (this.errorMSG = "Revenue Not Found"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 2e3);
              },
            });
        }
        closeModal() {
          let e = document.getElementById("edit-revenue-close"),
            t = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !0,
            });
          e.dispatchEvent(t);
        }
      }
      function q3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 1)(1, "button", 20),
            x("click", function () {
              return $(t), U(D().refreshMonthly(!1));
            }),
            _(2, " Add Revenue "),
            f()();
        }
        if (2 & n) {
          const t = D();
          y(1), v("disabled", t.loading);
        }
      }
      function W3(n, e) {
        1 & n && B(0, "div", 21);
      }
      function K3(n, e) {
        1 & n && (h(0, "th", 28), B(1, "i", 31), f());
      }
      function Q3(n, e) {
        1 & n && (h(0, "th", 28), B(1, "i", 32), f());
      }
      function Y3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "td", 34)(1, "button", 36),
            x("click", function () {
              $(t);
              const i = D().$implicit;
              return U(D(2).setSelectedRevenue(i));
            }),
            B(2, "i", 31),
            f()();
        }
      }
      function X3(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "td", 34)(1, "button", 37),
            x("click", function () {
              $(t);
              const i = D().$implicit;
              return U(D(2).DeleteRevenue(i));
            }),
            B(2, "i", 32),
            f()();
        }
      }
      function Z3(n, e) {
        if (
          (1 & n &&
            (h(0, "tr")(1, "td", 33),
            _(2),
            f(),
            h(3, "td", 34),
            _(4),
            f(),
            b(5, Y3, 3, 0, "td", 35),
            b(6, X3, 3, 0, "td", 35),
            f()),
          2 & n)
        ) {
          const t = e.$implicit,
            r = D(2);
          y(2),
            de(t.title),
            y(2),
            de(t.price),
            y(1),
            v("ngIf", !0 === r.isAdmin),
            y(1),
            v("ngIf", !0 === r.isAdmin);
        }
      }
      function J3(n, e) {
        if (
          (1 & n &&
            (h(0, "div")(1, "div", 22)(2, "h2", 23),
            _(3),
            f()(),
            h(4, "div", 24),
            _(5),
            f(),
            h(6, "div", 25)(7, "table", 26)(8, "thead")(9, "tr")(10, "th", 27),
            _(11, "Revenue"),
            f(),
            h(12, "th", 28),
            _(13, "$"),
            f(),
            b(14, K3, 2, 0, "th", 29),
            b(15, Q3, 2, 0, "th", 29),
            f()(),
            h(16, "tbody"),
            b(17, Z3, 7, 4, "tr", 30),
            f()()()()),
          2 & n)
        ) {
          const t = D();
          y(3),
            wr("", t.day, " ", t.monthName[t.month2], ""),
            y(2),
            de(t.errorMSG3),
            y(9),
            v("ngIf", !0 === t.isAdmin),
            y(1),
            v("ngIf", !0 === t.isAdmin),
            y(2),
            v("ngForOf", t.dailyRevenues);
        }
      }
      function e$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 38)(1, "app-add-revenue", 39),
            x("sendRefreshReq", function (i) {
              return $(t), U(D().handleModals(i));
            }),
            f()();
        }
      }
      function t$(n, e) {}
      function n$(n, e) {
        1 & n && B(0, "div");
      }
      function r$(n, e) {
        1 & n && (h(0, "h1"), _(1, "Loading ..."), f());
      }
      function i$(n, e) {
        if ((1 & n && (h(0, "h4", 44), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), de(t.errorMSG);
        }
      }
      function o$(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 40),
            b(1, n$, 1, 0, "div", 41),
            b(2, r$, 2, 0, "ng-template", null, 42, W),
            b(4, i$, 2, 1, "ng-template", null, 43, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D();
          y(1), v("ngIf", "" == i.errorMSG)("ngIfThen", t)("ngIfElse", r);
        }
      }
      function s$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "app-show-revenue", 45),
            x("Refresh", function (i) {
              return $(t), U(D().handleModals(i));
            }),
            f();
        }
        2 & n && v("revenue", D().selectedRevenue);
      }
      (ua.ɵfac = function (e) {
        return new (e || ua)(M(qn), M(mt));
      }),
        (ua.ɵcmp = Ae({
          type: ua,
          selectors: [["app-show-revenue"]],
          inputs: { revenue: "revenue" },
          outputs: { Refresh: "Refresh" },
          decls: 36,
          vars: 14,
          consts: [
            [
              "id",
              "edit-revenue-modal",
              "tabindex",
              "-1",
              "data-bs-backdrop",
              "static",
              "data-bs-keyboard",
              "false",
              "role",
              "dialog",
              "aria-labelledby",
              "edit-revenue-modal-title",
              "aria-hidden",
              "true",
              1,
              "modal",
              "fade",
            ],
            [
              "role",
              "document",
              1,
              "modal-dialog",
              "modal-dialog-scrollable",
              "modal-dialog-centered",
              "modal-sm",
            ],
            [1, "modal-content", "bg-dark"],
            [1, "modal-header"],
            [1, "modal-title", "text-bg-dark"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "aria-label",
              "Close",
              1,
              "btn-close",
            ],
            [1, "modal-body", "bg-secondary"],
            [
              "autocomplete",
              "off",
              "novalidate",
              "",
              1,
              "text-bg-secondary",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["editRevenueForm", "ngForm"],
            ["ngModelGroup", "", "name", "person"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "name",
              "placeholder",
              "customer-info",
              "minlength",
              "3",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["CustomerName", "ngModel"],
            ["for", "edit-revenue-name", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [1, "input-group", "mb-3"],
            [1, "input-group-text", "text-bg-dark"],
            [
              "type",
              "date",
              "name",
              "date",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Date", "ngModel"],
            [
              "type",
              "number",
              "name",
              "price",
              "required",
              "",
              "pattern",
              "^\\d+$",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Price", "ngModel"],
            ["class", "mb-3", 4, "ngIf"],
            [1, "text-danger", "text-center"],
            ["type", "submit", 1, "btn", "btn-dark", "mb-3", 3, "disabled"],
            [1, "modal-footer"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "id",
              "edit-revenue-close",
              1,
              "btn",
              "btn-secondary",
            ],
            [1, "text-danger"],
            [4, "ngIf"],
            [1, "mb-3"],
            ["for", "edit-revenue-notes", 1, "form-label"],
            [
              "name",
              "notes",
              "rows",
              "1",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
          ],
          template: function (e, t) {
            if (1 & e) {
              const r = se();
              h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h5", 4),
                _(5, "Revenue"),
                f(),
                B(6, "button", 5),
                f(),
                h(7, "div", 6)(8, "form", 7, 8),
                x("ngSubmit", function () {
                  $(r);
                  const o = I(9);
                  return U(t.onSubmit(o));
                }),
                h(10, "div", 9)(11, "div", 10)(12, "input", 11, 12),
                x("ngModelChange", function (o) {
                  return (t.revenue.title = o);
                }),
                f(),
                h(14, "label", 13),
                _(15, "Revenue"),
                f(),
                b(16, j3, 2, 1, "div", 14),
                f()(),
                h(17, "div", 15)(18, "div", 16),
                _(19, "Date:"),
                f(),
                h(20, "input", 17, 18),
                x("ngModelChange", function (o) {
                  return (t.revenue.date = o);
                }),
                f()(),
                h(22, "div", 15)(23, "div", 16),
                _(24, "$"),
                f(),
                h(25, "input", 19, 20),
                x("ngModelChange", function (o) {
                  return (t.revenue.price = o);
                }),
                f()(),
                b(27, G3, 2, 1, "div", 14),
                b(28, z3, 4, 1, "div", 21),
                h(29, "div", 22),
                _(30),
                f(),
                h(31, "button", 23),
                _(32, " Edit "),
                f()()(),
                h(33, "div", 24)(34, "button", 25),
                _(35, " Close "),
                f()()()()();
            }
            if (2 & e) {
              const r = I(9),
                i = I(13),
                o = I(21),
                s = I(26);
              y(12),
                be("is-invalid", i.invalid && i.touched),
                v("ngModel", t.revenue.title),
                y(4),
                v("ngIf", i.invalid && i.touched),
                y(4),
                be("is-invalid", o.invalid && o.touched),
                v("ngModel", t.revenue.date),
                y(5),
                be("is-invalid", s.invalid && s.touched),
                v("ngModel", t.revenue.price),
                y(2),
                v("ngIf", s.invalid && s.touched),
                y(1),
                v("ngIf", t.roles.includes(5150) || t.roles.includes(2001)),
                y(2),
                de(t.errorMSG),
                y(1),
                v("disabled", r.form.invalid);
            }
          },
          dependencies: [$e, zn, on, Pr, jt, Gn, an, Tn, di, kr, Rt, yo, sn],
        }));
      class ca {
        constructor(e, t) {
          (this._revenuesService = e),
            (this._loginService = t),
            (this.isAdmin = !1),
            (this.isEditor = !1),
            (this.loading = !0),
            (this.errorMSG = ""),
            (this.errorMSG2 = ""),
            (this.month = new Date().getMonth()),
            (this.year = new Date().getFullYear()),
            (this.firstDay = new Date(this.year, this.month).getDay()),
            (this.daysInMonth =
              32 - new Date(this.year, this.month, 32).getDate()),
            (this.currentDate = ""),
            (this.REVENUES = []),
            (this.day = 0),
            (this.month2 = 0),
            (this.dailyRevenues = []),
            (this.errorMSG3 = ""),
            (this.selectedRevenue = new Nu()),
            (this.monthName = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]);
        }
        ngOnInit() {
          this.getAllRevenues(),
            this.setCurrentDate(),
            (this.isAdmin = !!this._loginService
              .haveAccess()
              .UserInfo.roles.includes(5150)),
            (this.isEditor = !!this._loginService
              .haveAccess()
              .UserInfo.roles.includes(2001));
        }
        sendCalendarData() {
          return {
            firstDay: new Date(this.year, this.month).getDay(),
            daysInMonth: 32 - new Date(this.year, this.month, 32).getDate(),
          };
        }
        dailyDateSetter(e) {
          (this.day = e.day),
            (this.month2 = e.month),
            this.setDailyRevenues(this.formatDate(e.day, this.year, e.month));
        }
        prev() {
          this.month--,
            this.month < 0 && ((this.month = 11), this.year--),
            this.setCurrentDate();
        }
        next() {
          this.month++,
            this.month > 11 && ((this.month = 0), this.year++),
            this.setCurrentDate();
        }
        setCurrentDate() {
          this.currentDate = `${this.monthName[this.month]} ${this.year}`;
        }
        handleModals(e) {
          this.getAllRevenues();
        }
        setDailyRevenues(e) {
          this.dailyRevenues = this.REVENUES.filter((t) => t.date === e);
        }
        setSelectedRevenue(e) {
          this.selectedRevenue = { ...e };
        }
        getAllRevenues() {
          (this.errorMSG2 = ""),
            (this.loading = !0),
            this._revenuesService.getAllRevenues().subscribe({
              next: (e) => {
                (this.REVENUES = e.revenues),
                  this.setDailyRevenues(
                    this.formatDate(this.day, this.year, this.month)
                  ),
                  (this.loading = !1),
                  (this.errorMSG2 = "");
              },
              error: (e) => {
                (this.errorMSG = e.status),
                  (this.errorMSG2 = "Unexpected Error Occured"),
                  (this.errorMSG =
                    401 === e.status
                      ? "Unauthorized"
                      : 403 === e.status
                      ? "Forbiden"
                      : "Unexpected Error Occured");
              },
            });
        }
        formatDate(e, t, r) {
          return `${t}-${(r += 1) < 10 ? `0${r}` : String(r)}-${
            e < 10 ? `0${e}` : String(e)
          }`;
        }
        DeleteRevenue(e) {
          1 == window.confirm("Confirm delete") &&
            this._revenuesService.deleteRevenue(e._id).subscribe({
              next: () => {
                this.getAllRevenues(),
                  this.dailyRevenues.splice(this.dailyRevenues.indexOf(e), 1),
                  0 == this.dailyRevenues.length && (this.day = 0);
              },
              error: (r) => {
                (this.errorMSG3 =
                  401 === r.status
                    ? "Unauthorized"
                    : 403 === r.status
                    ? "Forbiden"
                    : 404 === r.status
                    ? "Revenue Not Found"
                    : "Unexpected Error Occured"),
                  setTimeout(() => {
                    this.errorMSG3 = "";
                  }, 2e3);
              },
            });
        }
        refreshMonthly(e) {
          this._revenuesService.setREFRESH(e);
        }
      }
      (ca.ɵfac = function (e) {
        return new (e || ca)(M(qn), M(mt));
      }),
        (ca.ɵcmp = Ae({
          type: ca,
          selectors: [["app-revenues"]],
          decls: 31,
          vars: 16,
          consts: [
            [
              "id",
              "add-revenues-tab",
              "role",
              "tablist",
              1,
              "nav",
              "nav-tabs",
              "text-bg-dark",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            ["role", "presentation", 1, "nav-item"],
            [
              "id",
              "daily-revenues-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#daily-revenues",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "daily-revenues",
              "aria-selected",
              "true",
              1,
              "nav-link",
              "active",
              3,
              "disabled",
            ],
            [
              "id",
              "monthly-revenues-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#monthly-revenues",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "monthly-revenues",
              "aria-selected",
              "false",
              1,
              "nav-link",
              3,
              "disabled",
              "click",
            ],
            ["class", "nav-item", "role", "presentation", 4, "ngIf"],
            ["class", "csmb", 4, "ngIf", "ngIfThen", "ngIfElse"],
            [1, "tab-content", "mx-auto", 2, "max-width", "600px"],
            [
              "id",
              "daily-revenues",
              "role",
              "tabpanel",
              "aria-labelledby",
              "daily-revenues-tab",
              1,
              "tab-pane",
              "active",
            ],
            [
              "id",
              "reservations-section",
              1,
              "text-bg-secondary",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            [
              1,
              "d-flex",
              "justify-content-around",
              "align-items-center",
              "p-2",
              "text-bg-dark",
              "border-bottom",
              "border-secondary",
            ],
            [1, "btn", "btn-secondary", 3, "click"],
            [
              1,
              "d-flex",
              "justify-content-center",
              "align-items-center",
              "p-2",
              "text-bg-dark",
            ],
            [
              3,
              "month",
              "year",
              "daysInMonth",
              "firstDay",
              "REVENUES",
              "sendDate",
            ],
            [4, "ngIf"],
            [
              "id",
              "monthly-revenues",
              "role",
              "tabpanel",
              "aria-labelledby",
              "monthly-revenues-tab",
              1,
              "tab-pane",
            ],
            [3, "REVENUES"],
            [
              "class",
              "tab-pane",
              "id",
              "add-revenues",
              "role",
              "tabpanel",
              "aria-labelledby",
              "add-revenues-tab",
              4,
              "ngIf",
            ],
            ["thenblock", ""],
            ["elseblock", ""],
            [3, "revenue", "Refresh", 4, "ngIf"],
            [
              "id",
              "add-revenues-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#add-revenues",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "add-revenues",
              "aria-selected",
              "false",
              1,
              "nav-link",
              3,
              "disabled",
              "click",
            ],
            [1, "csmb"],
            [1, "text-center", "text-bg-dark", "mt-2"],
            [1, "my-0"],
            [1, "text-center", "text-danger"],
            [1, "table-responsive"],
            [1, "table", "table-dark", "table-striped", "text-center"],
            ["scope", "col", 1, "col", "text-start"],
            ["scope", "col", 1, "col-1"],
            ["scope", "col", "class", "col-1", 4, "ngIf"],
            [4, "ngFor", "ngForOf"],
            [1, "fas", "fa-edit"],
            [1, "fas", "fa-trash"],
            [1, "text-start"],
            [1, "text-center"],
            ["class", "text-center", 4, "ngIf"],
            [
              "data-bs-toggle",
              "modal",
              "data-bs-target",
              "#edit-revenue-modal",
              1,
              "btn",
              "btn-sm",
              "btn-outline-info",
              3,
              "click",
            ],
            [1, "btn", "btn-sm", "btn-outline-danger", 3, "click"],
            [
              "id",
              "add-revenues",
              "role",
              "tabpanel",
              "aria-labelledby",
              "add-revenues-tab",
              1,
              "tab-pane",
            ],
            [3, "sendRefreshReq"],
            [1, "text-center", "text-bg-secondary"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "text-danger"],
            [3, "revenue", "Refresh"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "ul", 0)(1, "li", 1)(2, "button", 2),
                _(3, " Daily "),
                f()(),
                h(4, "li", 1)(5, "button", 3),
                x("click", function () {
                  return t.refreshMonthly(!0);
                }),
                _(6, " Monthly "),
                f()(),
                b(7, q3, 3, 1, "li", 4),
                f(),
                b(8, W3, 1, 0, "div", 5),
                h(9, "div", 6)(10, "div", 7)(11, "section", 8)(12, "div", 9)(
                  13,
                  "button",
                  10
                ),
                x("click", function () {
                  return t.prev();
                }),
                _(14, "<<"),
                f(),
                h(15, "span"),
                _(16),
                f(),
                h(17, "button", 10),
                x("click", function () {
                  return t.next();
                }),
                _(18, ">>"),
                f()(),
                h(19, "div", 11),
                _(20, " Revenues "),
                f(),
                h(21, "app-revenues-calendar", 12),
                x("sendDate", function (i) {
                  return t.dailyDateSetter(i);
                }),
                f(),
                b(22, J3, 18, 6, "div", 13),
                f()(),
                h(23, "div", 14),
                B(24, "app-monthly-revenues", 15),
                f(),
                b(25, e$, 2, 0, "div", 16),
                f(),
                b(26, t$, 0, 0, "ng-template", null, 17, W),
                b(28, o$, 6, 3, "ng-template", null, 18, W),
                b(30, s$, 1, 1, "app-show-revenue", 19)),
              2 & e)
            ) {
              const r = I(27),
                i = I(29);
              y(2),
                v("disabled", t.loading),
                y(3),
                v("disabled", t.loading),
                y(2),
                v("ngIf", !0 === t.isAdmin || !0 === t.isEditor),
                y(1),
                v("ngIf", !t.loading)("ngIfThen", r)("ngIfElse", i),
                y(8),
                de(t.currentDate),
                y(5),
                v("month", t.month)("year", t.year)(
                  "daysInMonth",
                  t.sendCalendarData().daysInMonth
                )("firstDay", t.sendCalendarData().firstDay)(
                  "REVENUES",
                  t.REVENUES
                ),
                y(1),
                v("ngIf", 0 !== t.day && !t.loading),
                y(2),
                v("REVENUES", t.REVENUES),
                y(1),
                v("ngIf", !0 === t.isAdmin || !0 === t.isEditor),
                y(5),
                v("ngIf", !0 === t.isAdmin);
            }
          },
          dependencies: [$n, $e, sa, aa, la, ua],
        }));
      class Or {
        constructor(e) {
          (this.http = e),
            (this.formDirty = new Nt()),
            (this.isDirty$ = this.formDirty.asObservable());
        }
        setFormDirty(e) {
          this.formDirty.next(e);
        }
        getAllUsers() {
          return this.http.get(`${ze}/users`).pipe(Ce((e) => Ie(() => e)));
        }
        addNewUser(e) {
          return this.http.post(`${ze}/users`, e).pipe(Ce((t) => Ie(() => t)));
        }
        getUser(e) {
          return this.http.get(`${ze}/users/${e}`).pipe(Ce((t) => Ie(() => t)));
        }
        editUser(e) {
          return this.http
            .patch(`${ze}/users/${e.username}`, e)
            .pipe(Ce((t) => Ie(() => t)));
        }
        deleteUser(e) {
          return this.http
            .delete(`${ze}/users/${e}`)
            .pipe(Ce((t) => Ie(() => t)));
        }
      }
      function a$(n, e) {
        1 & n && (h(0, "small"), _(1, "password is too short"), f());
      }
      function l$(n, e) {
        if (
          (1 & n && (h(0, "div", 26), b(1, a$, 2, 0, "small", 27), f()), 2 & n)
        ) {
          D();
          const t = I(2);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function u$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div", 21)(1, "input", 22, 23),
            x("ngModelChange", function (i) {
              return $(t), U((D().newPassword = i));
            }),
            f(),
            h(3, "label", 24),
            _(4, "Password"),
            f(),
            b(5, l$, 2, 1, "div", 25),
            f();
        }
        if (2 & n) {
          const t = I(2),
            r = D();
          y(1),
            be("is-invalid", t.invalid && t.touched),
            v("disabled", !r.isPassChecked)("ngModel", r.newPassword),
            y(4),
            v("ngIf", t.invalid && t.touched);
        }
      }
      (Or.ɵfac = function (e) {
        return new (e || Or)(N(go));
      }),
        (Or.ɵprov = O({ token: Or, factory: Or.ɵfac, providedIn: "root" }));
      class da {
        constructor(e) {
          (this._usersServive = e),
            (this.user = { username: "", roles: { user: 1984 } }),
            (this.isPassChecked = !1),
            (this.isAdminChecked = !1),
            (this.isEditorChecked = !1),
            (this.newPassword = ""),
            (this.errorMSG = "");
        }
        closeModal() {
          let e = document.getElementById("edit-modal-close"),
            t = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !0,
            });
          e.dispatchEvent(t), this.clearModal();
        }
        clearModal() {
          (this.isAdminChecked = !1),
            (this.isEditorChecked = !1),
            (this.isPassChecked = !1),
            (this.newPassword = ""),
            (this.user = { username: "", roles: { user: 1984 } });
        }
        editUser(e) {
          !0 === this.isPassChecked && (this.user.password = this.newPassword),
            this.isAdminChecked
              ? (this.user.roles.admin = 5150)
              : delete this.user.roles.admin,
            this.isEditorChecked
              ? (this.user.roles.editor = 2001)
              : delete this.user.roles.editor,
            this._usersServive.editUser(this.user).subscribe({
              next: () => {
                this.closeModal(), e.reset();
              },
              error: (t) => {
                (this.errorMSG =
                  401 === t.status
                    ? "Unauthorized"
                    : 403 === t.status
                    ? "Forbiden"
                    : 409 === t.status
                    ? "username already exists"
                    : "Unexpected Error Occured"),
                  setTimeout(() => {
                    (this.errorMSG = ""), this.closeModal(), e.reset();
                  }, 2e3);
              },
            });
        }
      }
      function c$(n, e) {
        1 & n && (h(0, "small"), _(1, "username is too short"), f());
      }
      function d$(n, e) {
        if (
          (1 & n && (h(0, "div", 19), b(1, c$, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(9);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function f$(n, e) {
        1 & n && (h(0, "small"), _(1, "password is too short"), f());
      }
      function h$(n, e) {
        if (
          (1 & n && (h(0, "div", 19), b(1, f$, 2, 0, "small", 0), f()), 2 & n)
        ) {
          D();
          const t = I(15);
          y(1), v("ngIf", null == t.errors ? null : t.errors.minlength);
        }
      }
      function p$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "div")(1, "form", 1, 2),
            x("submit", function () {
              $(t);
              const i = I(2);
              return U(D().addUser(i));
            }),
            h(3, "h1", 3),
            _(4, "Add User"),
            f(),
            h(5, "div", 4),
            _(6),
            f(),
            h(7, "div", 5)(8, "input", 6, 7),
            x("ngModelChange", function (i) {
              return $(t), U((D().user.username = i));
            }),
            f(),
            h(10, "label", 8),
            _(11, "Username"),
            f(),
            b(12, d$, 2, 1, "div", 9),
            f(),
            h(13, "div", 5)(14, "input", 10, 11),
            x("ngModelChange", function (i) {
              return $(t), U((D().user.password = i));
            }),
            f(),
            h(16, "label", 12),
            _(17, "Password"),
            f(),
            b(18, h$, 2, 1, "div", 9),
            f(),
            h(19, "div", 13)(20, "input", 14),
            x("ngModelChange", function (i) {
              return $(t), U((D().isAdminChecked = i));
            }),
            f(),
            h(21, "label", 15),
            _(22, " Admin "),
            f()(),
            h(23, "div", 13)(24, "input", 16),
            x("ngModelChange", function (i) {
              return $(t), U((D().isEditorChecked = i));
            }),
            f(),
            h(25, "label", 17),
            _(26, " Editor "),
            f()(),
            h(27, "button", 18),
            _(28, " Submit "),
            f()()();
        }
        if (2 & n) {
          const t = I(2),
            r = I(9),
            i = I(15),
            o = D();
          y(6),
            de(o.errorMSG),
            y(2),
            be("is-invalid", r.invalid && r.touched),
            v("ngModel", o.user.username),
            y(4),
            v("ngIf", r.invalid && r.touched),
            y(2),
            be("is-invalid", i.invalid && i.touched),
            v("ngModel", o.user.password),
            y(4),
            v("ngIf", i.invalid && i.touched),
            y(2),
            v("ngModel", o.isAdminChecked),
            y(4),
            v("ngModel", o.isEditorChecked),
            y(3),
            v("disabled", t.form.invalid);
        }
      }
      (da.ɵfac = function (e) {
        return new (e || da)(M(Or));
      }),
        (da.ɵcmp = Ae({
          type: da,
          selectors: [["app-user"]],
          inputs: { user: "user" },
          decls: 33,
          vars: 9,
          consts: [
            [
              "id",
              "edit-user-modal",
              "tabindex",
              "-1",
              "data-bs-backdrop",
              "static",
              "data-bs-keyboard",
              "false",
              "role",
              "dialog",
              "aria-labelledby",
              "edit-user-modal-title",
              "aria-hidden",
              "true",
              1,
              "modal",
              "fade",
            ],
            [
              "role",
              "document",
              1,
              "modal-dialog",
              "modal-dialog-scrollable",
              "modal-dialog-centered",
              "modal-sm",
            ],
            [1, "modal-content", "text-bg-dark"],
            [1, "modal-header"],
            [1, "modal-title", "text-center"],
            [
              "id",
              "edit-modal-close",
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              "aria-label",
              "Close",
              1,
              "btn-close",
              3,
              "click",
            ],
            [1, "modal-body"],
            [1, "text-center", "text-danger"],
            [
              "novalidate",
              "",
              "autocomplete",
              "off",
              1,
              "text-bg-secondary",
              "pt-3",
              "px-3",
              "rounded-4",
              "d-flex",
              "flex-column",
              3,
              "ngSubmit",
            ],
            ["UserForm", "ngForm"],
            [1, "py-3", "text-center"],
            ["id", "edit-user-usename"],
            [1, "form-check", "mx-auto"],
            [
              "type",
              "checkbox",
              "name",
              "check",
              1,
              "form-check-input",
              3,
              "checked",
              "change",
            ],
            [1, "form-check-label"],
            ["class", "form-floating mb-3", 4, "ngIf"],
            [
              "name",
              "admin",
              "type",
              "checkbox",
              "value",
              "admin",
              1,
              "form-check-input",
              3,
              "checked",
              "ngModel",
              "ngModelChange",
            ],
            [
              "name",
              "editor",
              "type",
              "checkbox",
              "value",
              "editor",
              1,
              "form-check-input",
              3,
              "checked",
              "ngModel",
              "ngModelChange",
            ],
            [1, "btn", "btn-dark", "mb-3", 3, "disabled"],
            [1, "modal-footer"],
            [
              "type",
              "button",
              "data-bs-dismiss",
              "modal",
              1,
              "btn",
              "btn-secondary",
              3,
              "click",
            ],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "password",
              "name",
              "password",
              "id",
              "password-edituser-input",
              "placeholder",
              "password",
              "minlength",
              "5",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "disabled",
              "ngModel",
              "ngModelChange",
            ],
            ["password", "ngModel"],
            ["for", "password-edituser-input", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [1, "text-danger"],
            [4, "ngIf"],
          ],
          template: function (e, t) {
            if (1 & e) {
              const r = se();
              h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h5", 4),
                _(5, "edit User"),
                f(),
                h(6, "button", 5),
                x("click", function () {
                  return t.clearModal();
                }),
                f()(),
                h(7, "div", 6)(8, "div", 7),
                _(9),
                f(),
                h(10, "form", 8, 9),
                x("ngSubmit", function () {
                  $(r);
                  const o = I(11);
                  return U(t.editUser(o));
                }),
                h(12, "h1", 10)(13, "span", 11),
                _(14),
                f()(),
                h(15, "div", 12)(16, "input", 13),
                x("change", function () {
                  return (t.isPassChecked = !t.isPassChecked);
                }),
                f(),
                h(17, "label", 14),
                _(18, " Change password "),
                f()(),
                b(19, u$, 6, 5, "div", 15),
                h(20, "div", 12)(21, "input", 16),
                x("ngModelChange", function (o) {
                  return (t.isAdminChecked = o);
                }),
                f(),
                h(22, "label", 14),
                _(23, " Admin "),
                f()(),
                h(24, "div", 12)(25, "input", 17),
                x("ngModelChange", function (o) {
                  return (t.isEditorChecked = o);
                }),
                f(),
                h(26, "label", 14),
                _(27, " Editor "),
                f()(),
                h(28, "button", 18),
                _(29, " Save "),
                f()()(),
                h(30, "div", 19)(31, "button", 20),
                x("click", function () {
                  return t.clearModal();
                }),
                _(32, " Close "),
                f()()()()();
            }
            if (2 & e) {
              const r = I(11);
              y(9),
                de(t.errorMSG),
                y(5),
                de(t.user.username),
                y(2),
                v("checked", t.isPassChecked),
                y(3),
                v("ngIf", t.isPassChecked),
                y(2),
                v("checked", t.user.roles.admin)("ngModel", t.isAdminChecked),
                y(4),
                v("checked", t.user.roles.editor)("ngModel", t.isEditorChecked),
                y(3),
                v("disabled", r.form.invalid);
            }
          },
          dependencies: [$e, zn, on, Cu, jt, Gn, an, Tn, Rt, sn],
        }));
      class fa {
        constructor(e) {
          (this._usersService = e),
            (this.user = { username: "", password: "", roles: { user: 1984 } }),
            (this.errorMSG = ""),
            (this.isAdminChecked = !1),
            (this.isEditorChecked = !1),
            (this.isFormDirty = !1);
        }
        ngOnInit() {
          this._usersService.isDirty$.subscribe((e) => {
            (this.isFormDirty = e), !0 === e && this.resetValues();
          });
        }
        addUser(e) {
          this.isAdminChecked
            ? (this.user.roles.admin = 5150)
            : delete this.user.roles.admin,
            this.isEditorChecked
              ? (this.user.roles.editor = 2001)
              : delete this.user.roles.editor,
            this._usersService.addNewUser(this.user).subscribe({
              next: () => {
                e.reset(),
                  (this.user = {
                    username: "",
                    password: "",
                    roles: { user: 1984 },
                  });
              },
              error: (t) => {
                (this.errorMSG =
                  401 === t.status
                    ? "Unauthorized"
                    : 403 === t.status
                    ? "Forbiden"
                    : 409 === t.status
                    ? "username already exists"
                    : "Unexpected Error Occured"),
                  setTimeout(() => {
                    this.errorMSG = "";
                  }, 2e3);
              },
            });
        }
        resetValues() {
          (this.user = { username: "", password: "", roles: { user: 1984 } }),
            (this.errorMSG = ""),
            (this.isAdminChecked = !1),
            (this.isEditorChecked = !1);
        }
      }
      function g$(n, e) {
        1 & n && B(0, "div");
      }
      function m$(n, e) {
        1 & n && B(0, "div");
      }
      function _$(n, e) {
        1 & n && _(0, "Admin");
      }
      function y$(n, e) {
        1 & n && B(0, "div");
      }
      function v$(n, e) {
        1 & n && _(0, "Editor");
      }
      function C$(n, e) {
        1 & n && _(0, "User");
      }
      function D$(n, e) {
        if (
          (1 & n &&
            (b(0, y$, 1, 0, "div", 5),
            b(1, v$, 1, 0, "ng-template", null, 23, W),
            b(3, C$, 1, 0, "ng-template", null, 24, W)),
          2 & n)
        ) {
          const t = I(2),
            r = I(4);
          v("ngIf", D().$implicit.roles.editor)("ngIfThen", t)("ngIfElse", r);
        }
      }
      function b$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "tr")(1, "td", 17),
            _(2),
            f(),
            h(3, "td"),
            b(4, m$, 1, 0, "div", 5),
            b(5, _$, 1, 0, "ng-template", null, 18, W),
            b(7, D$, 5, 3, "ng-template", null, 19, W),
            f(),
            h(9, "td", 20)(10, "button", 21),
            x("click", function () {
              const o = $(t).$implicit;
              return U(D(2).editUsername(o.username));
            }),
            B(11, "i", 13),
            f()(),
            h(12, "td", 20)(13, "button", 22),
            x("click", function () {
              const o = $(t).$implicit;
              return U(D(2).deleteUser(o.username));
            }),
            B(14, "i", 14),
            f()()();
        }
        if (2 & n) {
          const t = e.$implicit,
            r = I(6),
            i = I(8);
          y(2),
            de(t.username),
            y(2),
            v("ngIf", t.roles.admin)("ngIfThen", r)("ngIfElse", i);
        }
      }
      function E$(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 9)(1, "table", 10)(2, "thead")(3, "tr")(4, "th", 11),
            _(5, "Name"),
            f(),
            h(6, "th", 12),
            _(7, "Role"),
            f(),
            h(8, "th", 12),
            B(9, "i", 13),
            f(),
            h(10, "th", 12),
            B(11, "i", 14),
            f()()(),
            h(12, "tbody"),
            b(13, b$, 15, 4, "tr", 15),
            f()()(),
            h(14, "div", 16),
            B(15, "app-add-user"),
            f()),
          2 & n)
        ) {
          const t = D();
          y(13), v("ngForOf", t.allUsers);
        }
      }
      function w$(n, e) {
        1 & n && B(0, "div");
      }
      function S$(n, e) {
        1 & n && (h(0, "h1"), _(1, "Loading ..."), f());
      }
      function M$(n, e) {
        if ((1 & n && (h(0, "h4", 28), _(1), f()), 2 & n)) {
          const t = D(2);
          y(1), de(t.errorMSG);
        }
      }
      function T$(n, e) {
        if (
          (1 & n &&
            (h(0, "div", 25),
            b(1, w$, 1, 0, "div", 5),
            b(2, S$, 2, 0, "ng-template", null, 26, W),
            b(4, M$, 2, 1, "ng-template", null, 27, W),
            f()),
          2 & n)
        ) {
          const t = I(3),
            r = I(5),
            i = D();
          y(1), v("ngIf", "" == i.errorMSG)("ngIfThen", t)("ngIfElse", r);
        }
      }
      (fa.ɵfac = function (e) {
        return new (e || fa)(M(Or));
      }),
        (fa.ɵcmp = Ae({
          type: fa,
          selectors: [["app-add-user"]],
          decls: 1,
          vars: 1,
          consts: [
            [4, "ngIf"],
            [
              "novalidate",
              "",
              "autocomplete",
              "off",
              "aria-required",
              "true",
              1,
              "text-bg-dark",
              "pt-3",
              "px-3",
              "rounded-bottom",
              "d-flex",
              "flex-column",
              "mx-auto",
              3,
              "submit",
            ],
            ["addUserForm", "ngForm"],
            [1, "py-3", "text-center"],
            [1, "text-danger", "text-center"],
            [1, "form-floating", "mb-3"],
            [
              "type",
              "text",
              "name",
              "username",
              "placeholder",
              "username",
              "minlength",
              "5",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Fusername", "ngModel"],
            ["for", "username-adduser-input", 1, "text-secondary"],
            ["class", "text-danger", 4, "ngIf"],
            [
              "type",
              "password",
              "name",
              "password",
              "placeholder",
              "password",
              "minlength",
              "5",
              "maxlength",
              "15",
              "required",
              "",
              1,
              "form-control",
              "text-bg-dark",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["Fpassword", "ngModel"],
            ["for", "password-adduser-input", 1, "text-secondary"],
            [1, "form-check", "mx-auto"],
            [
              "type",
              "checkbox",
              "value",
              "admin",
              "name",
              "admin",
              1,
              "form-check-input",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["for", "admin-adduser-checkbox", 1, "form-check-label"],
            [
              "type",
              "checkbox",
              "value",
              "editor",
              "name",
              "editor",
              1,
              "form-check-input",
              3,
              "ngModel",
              "ngModelChange",
            ],
            ["for", "editor-adduser-checkbox", 1, "form-check-label"],
            [1, "btn", "btn-secondary", "my-5", 3, "disabled"],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            1 & e && b(0, p$, 29, 12, "div", 0),
              2 & e && v("ngIf", !t.isFormDirty);
          },
          dependencies: [$e, zn, on, Cu, jt, Gn, an, Tn, di, Rt, sn],
        }));
      class ha {
        constructor(e) {
          (this._usersService = e),
            (this.allUsers = []),
            (this.user = { username: "", roles: { user: 1984 } }),
            (this.username = ""),
            (this.loading = !0),
            (this.errorMSG = "");
        }
        ngOnInit() {
          this.showAllUsers();
        }
        editUsername(e) {
          (this.username = e), this.showUser();
        }
        showAllUsers() {
          (this.loading = !0),
            (this.errorMSG = ""),
            this._usersService.getAllUsers().subscribe({
              next: (e) => {
                (this.allUsers = []),
                  (this.allUsers = e.users),
                  (this.loading = !1),
                  (this.errorMSG = "");
              },
              error: (e) => {
                (this.errorMSG = "Unexpected Error Occured"),
                  401 === e.status && (this.errorMSG = "Unauthorized"),
                  403 === e.status && (this.errorMSG = "Forbiden"),
                  setTimeout(() => {}, 2e3);
              },
            });
        }
        showUser() {
          this._usersService.getUser(this.username).subscribe({
            next: (e) => {
              (this.user = { username: "", roles: { user: 1984 } }),
                (this.user = e.user),
                delete this.user.password,
                console.log(this.user);
            },
            error: (e) => {
              window.alert("unexpected error occured");
            },
          });
        }
        deleteUser(e) {
          !0 === window.confirm("Confirm Delete") &&
            this._usersService.deleteUser(e).subscribe(() => {
              this.showAllUsers(), (this.username = "");
            });
        }
        changeFormStatus(e) {
          this._usersService.setFormDirty(e);
        }
      }
      (ha.ɵfac = function (e) {
        return new (e || ha)(M(Or));
      }),
        (ha.ɵcmp = Ae({
          type: ha,
          selectors: [["app-all-users"]],
          decls: 14,
          vars: 4,
          consts: [
            [
              "id",
              "myTab",
              "role",
              "tablist",
              1,
              "nav",
              "nav-tabs",
              "text-bg-dark",
              "mx-auto",
              2,
              "max-width",
              "600px",
            ],
            ["role", "presentation", 1, "nav-item"],
            [
              "id",
              "home-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#home",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "home",
              "aria-selected",
              "true",
              1,
              "nav-link",
              "active",
              3,
              "click",
            ],
            [
              "id",
              "add-user-tab",
              "data-bs-toggle",
              "tab",
              "data-bs-target",
              "#add-user",
              "type",
              "button",
              "role",
              "tab",
              "aria-controls",
              "add-user",
              "aria-selected",
              "false",
              1,
              "nav-link",
              3,
              "click",
            ],
            [1, "tab-content", "mx-auto", 2, "max-width", "600px"],
            [4, "ngIf", "ngIfThen", "ngIfElse"],
            [3, "user"],
            ["thenblock", ""],
            ["elseblock", ""],
            [
              "id",
              "home",
              "role",
              "tabpanel",
              "aria-labelledby",
              "home-tab",
              1,
              "tab-pane",
              "active",
            ],
            [1, "table", "table-dark", "table-striped", "text-center"],
            ["scope", "col", 1, "col", "text-start"],
            ["scope", "col", 1, "col-1"],
            [1, "fas", "fa-edit"],
            [1, "fas", "fa-trash"],
            [4, "ngFor", "ngForOf"],
            [
              "id",
              "add-user",
              "role",
              "tabpanel",
              "aria-labelledby",
              "add-user-tab",
              1,
              "tab-pane",
            ],
            [1, "text-start"],
            ["thenBlock3", ""],
            ["elseBlock3", ""],
            [1, "text-center"],
            [
              "data-bs-toggle",
              "modal",
              "data-bs-target",
              "#edit-user-modal",
              1,
              "btn",
              "btn-sm",
              "btn-outline-info",
              3,
              "click",
            ],
            [1, "btn", "btn-sm", "btn-outline-danger", 3, "click"],
            ["thenBlock4", ""],
            ["elseBlock4", ""],
            [1, "text-center", "text-bg-secondary"],
            ["thenblock2", ""],
            ["elseblock2", ""],
            [1, "text-danger"],
          ],
          template: function (e, t) {
            if (
              (1 & e &&
                (h(0, "ul", 0)(1, "li", 1)(2, "button", 2),
                x("click", function () {
                  return t.showAllUsers(), t.changeFormStatus(!0);
                }),
                _(3, " all users "),
                f()(),
                h(4, "li", 1)(5, "button", 3),
                x("click", function () {
                  return t.changeFormStatus(!1);
                }),
                _(6, " add new user "),
                f()()(),
                h(7, "div", 4),
                b(8, g$, 1, 0, "div", 5),
                f(),
                B(9, "app-user", 6),
                b(10, E$, 16, 1, "ng-template", null, 7, W),
                b(12, T$, 6, 3, "ng-template", null, 8, W)),
              2 & e)
            ) {
              const r = I(11),
                i = I(13);
              y(8),
                v("ngIf", !t.loading)("ngIfThen", r)("ngIfElse", i),
                y(1),
                v("user", t.user);
            }
          },
          dependencies: [$n, $e, da, fa],
        }));
      const I$ = [
        { path: "", pathMatch: "full", redirectTo: "/home" },
        { path: "home", component: Zs },
        { path: "login", component: Js },
        {
          path: "reservations",
          component: oa,
          canActivate: [Mn],
          data: { role: 1984 },
        },
        {
          path: "users",
          component: ha,
          canActivate: [Mn],
          data: { role: 5150 },
        },
        {
          path: "expences",
          component: Xs,
          canActivate: [Mn],
          data: { role: 1984 },
        },
        {
          path: "revenues",
          component: ca,
          canActivate: [Mn],
          data: { role: 1984 },
        },
        {
          path: "profit",
          component: ta,
          canActivate: [Mn],
          data: { role: 1984 },
        },
        { path: "**", component: ea, canActivate: [Mn], data: { role: 1984 } },
      ];
      class Do {}
      function A$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 8)(1, "a", 18),
            x("click", function () {
              return $(t), U(D().closeHeader());
            }),
            _(2, " Users "),
            f()();
        }
      }
      function x$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 8)(1, "a", 19),
            x("click", function () {
              return $(t), U(D().closeHeader());
            }),
            _(2, " Reservations "),
            f()();
        }
      }
      function R$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 8)(1, "a", 20),
            x("click", function () {
              return $(t), U(D().closeHeader());
            }),
            _(2, " Expences "),
            f()();
        }
      }
      function N$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 8)(1, "a", 21),
            x("click", function () {
              return $(t), U(D().closeHeader());
            }),
            _(2, " Revenues "),
            f()();
        }
      }
      function F$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 8)(1, "a", 22),
            x("click", function () {
              return $(t), U(D().closeHeader());
            }),
            _(2, " Profits "),
            f()();
        }
      }
      function P$(n, e) {
        if (1 & n) {
          const t = se();
          h(0, "li", 23)(1, "a", 24),
            x("click", function () {
              $(t);
              const i = D();
              return i.closeHeader(), U(i.logOut());
            }),
            _(2, " Log Out "),
            f()();
        }
      }
      (Do.ɵfac = function (e) {
        return new (e || Do)();
      }),
        (Do.ɵmod = Qt({ type: Do })),
        (Do.ɵinj = Pt({ imports: [Yb.forRoot(I$), Yb] }));
      class pa {
        constructor(e, t) {
          (this._loginService = e),
            (this.router = t),
            (this.loggedin = !1),
            (this.isAdmin = !1),
            (this.date = new Date().getFullYear());
        }
        ngOnInit() {
          let e = this._loginService.haveAccess().UserInfo.roles;
          e.includes(5150) && (this.isAdmin = !0),
            e.includes(1984) && (this.loggedin = !0),
            this._loginService.DATA$.subscribe((t) => {
              (this.isAdmin = !!t.roles.includes(5150)),
                (this.loggedin = !!t.roles.includes(1984));
            });
        }
        closeHeader() {
          if (window.innerWidth < 770) {
            let t = document.getElementById("header-btn"),
              r = new MouseEvent("click", {
                view: window,
                bubbles: !0,
                cancelable: !0,
              });
            t.dispatchEvent(r);
          }
        }
        logOut() {
          this._loginService.logOut().subscribe(),
            this._loginService.setDATA(new np()),
            (this.loggedin = !1),
            (this.isAdmin = !1),
            sessionStorage.clear(),
            this.router.navigate(["/home"]);
        }
      }
      (pa.ɵfac = function (e) {
        return new (e || pa)(M(mt), M(ut));
      }),
        (pa.ɵcmp = Ae({
          type: pa,
          selectors: [["app-root"]],
          decls: 30,
          vars: 7,
          consts: [
            [1, "text-warning", "bg-dark", "text-warning", "mb-2"],
            [
              1,
              "text-warning",
              "navbar",
              "navbar-expand-md",
              "navbar-dark",
              "bg-dark",
            ],
            [1, "text-warning", "container"],
            [1, "text-warning", "navbar-brand"],
            [
              "type",
              "button",
              "data-bs-toggle",
              "collapse",
              "data-bs-target",
              "#collapsibleNavId",
              "aria-controls",
              "collapsibleNavId",
              "aria-expanded",
              "false",
              "aria-label",
              "Toggle navigation",
              "id",
              "header-btn",
              1,
              "text-warning",
              "navbar-toggler",
              "d-lg-none",
            ],
            [1, "navbar-toggler-icon"],
            ["id", "collapsibleNavId", 1, "collapse", "navbar-collapse"],
            [1, "navbar-nav", "me-auto", "mt-2", "mt-lg-0"],
            [1, "nav-item"],
            [
              "routerLink",
              "/home",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            ["class", "nav-item", 4, "ngIf"],
            ["class", "nav-item", "style", "cursor: pointer", 4, "ngIf"],
            ["id", "spacer"],
            [1, "text-warning", "bg-dark", "text-warning"],
            [1, "text-warning", "row"],
            [1, "text-warning", "col-4"],
            [1, "text-warning", "col-8", "text-end"],
            [
              "href",
              "https://www.linkedin.com/in/karam-b-karam",
              "target",
              "_blank",
            ],
            [
              "routerLink",
              "/users",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            [
              "routerLink",
              "/reservations",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            [
              "routerLink",
              "/expences",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            [
              "routerLink",
              "/revenues",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            [
              "routerLink",
              "/profit",
              "routerLinkActive",
              "text-warning",
              "ariaCurrentWhenActive",
              "page",
              1,
              "nav-link",
              3,
              "click",
            ],
            [1, "nav-item", 2, "cursor", "pointer"],
            [1, "nav-link", 3, "click"],
          ],
          template: function (e, t) {
            1 & e &&
              (h(0, "header", 0)(1, "nav", 1)(2, "div", 2)(3, "a", 3),
              _(4, "Night In Paradise"),
              f(),
              h(5, "button", 4),
              B(6, "span", 5),
              f(),
              h(7, "div", 6)(8, "ul", 7)(9, "li", 8)(10, "a", 9),
              x("click", function () {
                return t.closeHeader();
              }),
              _(11, " Home "),
              f()(),
              b(12, A$, 3, 0, "li", 10),
              b(13, x$, 3, 0, "li", 10),
              b(14, R$, 3, 0, "li", 10),
              b(15, N$, 3, 0, "li", 10),
              b(16, F$, 3, 0, "li", 10),
              b(17, P$, 3, 0, "li", 11),
              f()()()()(),
              B(18, "router-outlet"),
              h(19, "div", 12),
              _(20, "developed by karam"),
              f(),
              h(21, "footer", 13)(22, "div", 2)(23, "div", 14)(24, "div", 15),
              _(25),
              f(),
              h(26, "div", 16),
              _(27, " Developped by "),
              h(28, "a", 17),
              _(29, "Karam"),
              f()()()()()),
              2 & e &&
                (y(12),
                v("ngIf", t.loggedin && t.isAdmin),
                y(1),
                v("ngIf", t.loggedin),
                y(1),
                v("ngIf", t.loggedin),
                y(1),
                v("ngIf", t.loggedin),
                y(1),
                v("ngIf", t.loggedin),
                y(1),
                v("ngIf", t.loggedin),
                y(8),
                Fe("\xa9 ", t.date, ""));
          },
          dependencies: [$e, Ch, ho, Ah],
          styles: [
            "footer[_ngcontent-%COMP%]{position:fixed;bottom:0;width:100%;font-size:10px}footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;text-decoration:none}#spacer[_ngcontent-%COMP%]{text-align:center;height:30px;opacity:0}",
          ],
        }));
      class bo {
        constructor(e, t) {
          (this._inject = e), (this.router = t);
        }
        intercept(e, t) {
          let r = this._inject.get(mt),
            i = e.clone({
              setHeaders: { Authorization: "Bearer " + r.getToken() },
              withCredentials: !0,
            });
          return t.handle(i).pipe(
            Ce(
              (o) => (
                1 == r.isRefreshTokenCalled &&
                  (sessionStorage.clear(),
                  this.router.navigate(["/home"]),
                  r.setDATA(new np())),
                403 !== o.status || r.isRefreshTokenCalled
                  ? Ie(() => o)
                  : ((r.isRefreshTokenCalled = !0),
                    Be(r.refreshToken()).pipe(
                      Sn(
                        () => (
                          (i = e.clone({
                            setHeaders: {
                              Authorization: "Bearer " + r.getToken(),
                            },
                            withCredentials: !0,
                          })),
                          t.handle(i)
                        )
                      ),
                      Ce((s) => Ie(() => s))
                    ))
              )
            )
          );
        }
      }
      (bo.ɵfac = function (e) {
        return new (e || bo)(N(Jt), N(ut));
      }),
        (bo.ɵprov = O({ token: bo, factory: bo.ɵfac, providedIn: "root" }));
      class d1 {}
      class k$ {}
      const pr = "*";
      function f1(n, e = null) {
        return { type: 2, steps: n, options: e };
      }
      function h1(n) {
        return { type: 6, styles: n, offset: null };
      }
      function p1(n) {
        Promise.resolve().then(n);
      }
      class ga {
        constructor(e = 0, t = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = e + t);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          p1(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(e) {
          this._position = this.totalTime ? e * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach((r) => r()), (t.length = 0);
        }
      }
      class g1 {
        constructor(e) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = e);
          let t = 0,
            r = 0,
            i = 0;
          const o = this.players.length;
          0 == o
            ? p1(() => this._onFinish())
            : this.players.forEach((s) => {
                s.onDone(() => {
                  ++t == o && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == o && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++i == o && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (s, a) => Math.max(s, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((e) => e.init());
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((e) => e()),
            (this._onStartFns = []));
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((e) => e.play());
        }
        pause() {
          this.players.forEach((e) => e.pause());
        }
        restart() {
          this.players.forEach((e) => e.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((e) => e.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((e) => e.destroy()),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((e) => e.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(e) {
          const t = e * this.totalTime;
          this.players.forEach((r) => {
            const i = r.totalTime ? Math.min(1, t / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const e = this.players.reduce(
            (t, r) => (null === t || r.totalTime > t.totalTime ? r : t),
            null
          );
          return null != e ? e.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((e) => {
            e.beforeDestroy && e.beforeDestroy();
          });
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach((r) => r()), (t.length = 0);
        }
      }
      function m1(n) {
        return new T(3e3, !1);
      }
      function mU() {
        return typeof window < "u" && typeof window.document < "u";
      }
      function ip() {
        return (
          typeof process < "u" &&
          "[object process]" === {}.toString.call(process)
        );
      }
      function Lr(n) {
        switch (n.length) {
          case 0:
            return new ga();
          case 1:
            return n[0];
          default:
            return new g1(n);
        }
      }
      function _1(n, e, t, r, i = new Map(), o = new Map()) {
        const s = [],
          a = [];
        let l = -1,
          u = null;
        if (
          (r.forEach((c) => {
            const d = c.get("offset"),
              p = d == l,
              g = (p && u) || new Map();
            c.forEach((m, C) => {
              let E = C,
                w = m;
              if ("offset" !== C)
                switch (((E = e.normalizePropertyName(E, s)), w)) {
                  case "!":
                    w = i.get(C);
                    break;
                  case pr:
                    w = o.get(C);
                    break;
                  default:
                    w = e.normalizeStyleValue(C, E, w, s);
                }
              g.set(E, w);
            }),
              p || a.push(g),
              (u = g),
              (l = d);
          }),
          s.length)
        )
          throw (function iU(n) {
            return new T(3502, !1);
          })();
        return a;
      }
      function op(n, e, t, r) {
        switch (e) {
          case "start":
            n.onStart(() => r(t && sp(t, "start", n)));
            break;
          case "done":
            n.onDone(() => r(t && sp(t, "done", n)));
            break;
          case "destroy":
            n.onDestroy(() => r(t && sp(t, "destroy", n)));
        }
      }
      function sp(n, e, t) {
        const o = ap(
            n.element,
            n.triggerName,
            n.fromState,
            n.toState,
            e || n.phaseName,
            t.totalTime ?? n.totalTime,
            !!t.disabled
          ),
          s = n._data;
        return null != s && (o._data = s), o;
      }
      function ap(n, e, t, r, i = "", o = 0, s) {
        return {
          element: n,
          triggerName: e,
          fromState: t,
          toState: r,
          phaseName: i,
          totalTime: o,
          disabled: !!s,
        };
      }
      function Ht(n, e, t) {
        let r = n.get(e);
        return r || n.set(e, (r = t)), r;
      }
      function y1(n) {
        const e = n.indexOf(":");
        return [n.substring(1, e), n.slice(e + 1)];
      }
      let lp = (n, e) => !1,
        v1 = (n, e, t) => [],
        C1 = null;
      function up(n) {
        const e = n.parentNode || n.host;
        return e === C1 ? null : e;
      }
      (ip() || typeof Element < "u") &&
        (mU()
          ? ((C1 = (() => document.documentElement)()),
            (lp = (n, e) => {
              for (; e; ) {
                if (e === n) return !0;
                e = up(e);
              }
              return !1;
            }))
          : (lp = (n, e) => n.contains(e)),
        (v1 = (n, e, t) => {
          if (t) return Array.from(n.querySelectorAll(e));
          const r = n.querySelector(e);
          return r ? [r] : [];
        }));
      let fi = null,
        D1 = !1;
      const b1 = lp,
        E1 = v1;
      let w1 = (() => {
          class n {
            validateStyleProperty(t) {
              return (function yU(n) {
                fi ||
                  ((fi =
                    (function vU() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (D1 = !!fi.style && "WebkitAppearance" in fi.style));
                let e = !0;
                return (
                  fi.style &&
                    !(function _U(n) {
                      return "ebkit" == n.substring(1, 6);
                    })(n) &&
                    ((e = n in fi.style),
                    !e &&
                      D1 &&
                      (e =
                        "Webkit" + n.charAt(0).toUpperCase() + n.slice(1) in
                        fi.style)),
                  e
                );
              })(t);
            }
            matchesElement(t, r) {
              return !1;
            }
            containsElement(t, r) {
              return b1(t, r);
            }
            getParentElement(t) {
              return up(t);
            }
            query(t, r, i) {
              return E1(t, r, i);
            }
            computeStyle(t, r, i) {
              return i || "";
            }
            animate(t, r, i, o, s, a = [], l) {
              return new ga(i, o);
            }
          }
          return (
            (n.ɵfac = function (t) {
              return new (t || n)();
            }),
            (n.ɵprov = O({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        cp = (() => {
          class n {}
          return (n.NOOP = new w1()), n;
        })();
      const dp = "ng-enter",
        Fu = "ng-leave",
        Pu = "ng-trigger",
        ku = ".ng-trigger",
        M1 = "ng-animating",
        fp = ".ng-animating";
      function gr(n) {
        if ("number" == typeof n) return n;
        const e = n.match(/^(-?[\.\d]+)(m?s)/);
        return !e || e.length < 2 ? 0 : hp(parseFloat(e[1]), e[2]);
      }
      function hp(n, e) {
        return "s" === e ? 1e3 * n : n;
      }
      function Ou(n, e, t) {
        return n.hasOwnProperty("duration")
          ? n
          : (function bU(n, e, t) {
              let i,
                o = 0,
                s = "";
              if ("string" == typeof n) {
                const a = n.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return e.push(m1()), { duration: 0, delay: 0, easing: "" };
                i = hp(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (o = hp(parseFloat(l), a[4]));
                const u = a[5];
                u && (s = u);
              } else i = n;
              if (!t) {
                let a = !1,
                  l = e.length;
                i < 0 &&
                  (e.push(
                    (function O$() {
                      return new T(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  o < 0 &&
                    (e.push(
                      (function L$() {
                        return new T(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && e.splice(l, 0, m1());
              }
              return { duration: i, delay: o, easing: s };
            })(n, e, t);
      }
      function ma(n, e = {}) {
        return (
          Object.keys(n).forEach((t) => {
            e[t] = n[t];
          }),
          e
        );
      }
      function T1(n) {
        const e = new Map();
        return (
          Object.keys(n).forEach((t) => {
            e.set(t, n[t]);
          }),
          e
        );
      }
      function Vr(n, e = new Map(), t) {
        if (t) for (let [r, i] of t) e.set(r, i);
        for (let [r, i] of n) e.set(r, i);
        return e;
      }
      function A1(n, e, t) {
        return t ? e + ":" + t + ";" : "";
      }
      function x1(n) {
        let e = "";
        for (let t = 0; t < n.style.length; t++) {
          const r = n.style.item(t);
          e += A1(0, r, n.style.getPropertyValue(r));
        }
        for (const t in n.style)
          n.style.hasOwnProperty(t) &&
            !t.startsWith("_") &&
            (e += A1(0, MU(t), n.style[t]));
        n.setAttribute("style", e);
      }
      function Wn(n, e, t) {
        n.style &&
          (e.forEach((r, i) => {
            const o = gp(i);
            t && !t.has(i) && t.set(i, n.style[o]), (n.style[o] = r);
          }),
          ip() && x1(n));
      }
      function hi(n, e) {
        n.style &&
          (e.forEach((t, r) => {
            const i = gp(r);
            n.style[i] = "";
          }),
          ip() && x1(n));
      }
      function _a(n) {
        return Array.isArray(n) ? (1 == n.length ? n[0] : f1(n)) : n;
      }
      const pp = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function R1(n) {
        let e = [];
        if ("string" == typeof n) {
          let t;
          for (; (t = pp.exec(n)); ) e.push(t[1]);
          pp.lastIndex = 0;
        }
        return e;
      }
      function ya(n, e, t) {
        const r = n.toString(),
          i = r.replace(pp, (o, s) => {
            let a = e[s];
            return (
              null == a &&
                (t.push(
                  (function $$(n) {
                    return new T(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? n : i;
      }
      function Lu(n) {
        const e = [];
        let t = n.next();
        for (; !t.done; ) e.push(t.value), (t = n.next());
        return e;
      }
      const SU = /-+([a-z0-9])/g;
      function gp(n) {
        return n.replace(SU, (...e) => e[1].toUpperCase());
      }
      function MU(n) {
        return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function Gt(n, e, t) {
        switch (e.type) {
          case 7:
            return n.visitTrigger(e, t);
          case 0:
            return n.visitState(e, t);
          case 1:
            return n.visitTransition(e, t);
          case 2:
            return n.visitSequence(e, t);
          case 3:
            return n.visitGroup(e, t);
          case 4:
            return n.visitAnimate(e, t);
          case 5:
            return n.visitKeyframes(e, t);
          case 6:
            return n.visitStyle(e, t);
          case 8:
            return n.visitReference(e, t);
          case 9:
            return n.visitAnimateChild(e, t);
          case 10:
            return n.visitAnimateRef(e, t);
          case 11:
            return n.visitQuery(e, t);
          case 12:
            return n.visitStagger(e, t);
          default:
            throw (function U$(n) {
              return new T(3004, !1);
            })();
        }
      }
      function N1(n, e) {
        return window.getComputedStyle(n)[e];
      }
      function NU(n, e) {
        const t = [];
        return (
          "string" == typeof n
            ? n.split(/\s*,\s*/).forEach((r) =>
                (function FU(n, e, t) {
                  if (":" == n[0]) {
                    const l = (function PU(n, e) {
                      switch (n) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (t, r) => parseFloat(r) > parseFloat(t);
                        case ":decrement":
                          return (t, r) => parseFloat(r) < parseFloat(t);
                        default:
                          return (
                            e.push(
                              (function eU(n) {
                                return new T(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(n, t);
                    if ("function" == typeof l) return void e.push(l);
                    n = l;
                  }
                  const r = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      t.push(
                        (function J$(n) {
                          return new T(3015, !1);
                        })()
                      ),
                      e
                    );
                  const i = r[1],
                    o = r[2],
                    s = r[3];
                  e.push(F1(i, s));
                  "<" == o[0] && !("*" == i && "*" == s) && e.push(F1(s, i));
                })(r, t, e)
              )
            : t.push(n),
          t
        );
      }
      const Bu = new Set(["true", "1"]),
        ju = new Set(["false", "0"]);
      function F1(n, e) {
        const t = Bu.has(n) || ju.has(n),
          r = Bu.has(e) || ju.has(e);
        return (i, o) => {
          let s = "*" == n || n == i,
            a = "*" == e || e == o;
          return (
            !s && t && "boolean" == typeof i && (s = i ? Bu.has(n) : ju.has(n)),
            !a && r && "boolean" == typeof o && (a = o ? Bu.has(e) : ju.has(e)),
            s && a
          );
        };
      }
      const kU = new RegExp("s*:selfs*,?", "g");
      function mp(n, e, t, r) {
        return new OU(n).build(e, t, r);
      }
      class OU {
        constructor(e) {
          this._driver = e;
        }
        build(e, t, r) {
          const i = new $U(t);
          return this._resetContextStyleTimingState(i), Gt(this, _a(e), i);
        }
        _resetContextStyleTimingState(e) {
          (e.currentQuerySelector = ""),
            (e.collectedStyles = new Map()),
            e.collectedStyles.set("", new Map()),
            (e.currentTime = 0);
        }
        visitTrigger(e, t) {
          let r = (t.queryCount = 0),
            i = (t.depCount = 0);
          const o = [],
            s = [];
          return (
            "@" == e.name.charAt(0) &&
              t.errors.push(
                (function j$() {
                  return new T(3006, !1);
                })()
              ),
            e.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(t), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((c) => {
                    (l.name = c), o.push(this.visitState(l, t));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, t);
                (r += l.queryCount), (i += l.depCount), s.push(l);
              } else
                t.errors.push(
                  (function H$() {
                    return new T(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: e.name,
              states: o,
              transitions: s,
              queryCount: r,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(e, t) {
          const r = this.visitStyle(e.styles, t),
            i = (e.options && e.options.params) || null;
          if (r.containsDynamicStyles) {
            const o = new Set(),
              s = i || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  R1(l).forEach((u) => {
                    s.hasOwnProperty(u) || o.add(u);
                  });
                });
            }),
              o.size &&
                (Lu(o.values()),
                t.errors.push(
                  (function G$(n, e) {
                    return new T(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: e.name,
            style: r,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(e, t) {
          (t.queryCount = 0), (t.depCount = 0);
          const r = Gt(this, _a(e.animation), t);
          return {
            type: 1,
            matchers: NU(e.expr, t.errors),
            animation: r,
            queryCount: t.queryCount,
            depCount: t.depCount,
            options: pi(e.options),
          };
        }
        visitSequence(e, t) {
          return {
            type: 2,
            steps: e.steps.map((r) => Gt(this, r, t)),
            options: pi(e.options),
          };
        }
        visitGroup(e, t) {
          const r = t.currentTime;
          let i = 0;
          const o = e.steps.map((s) => {
            t.currentTime = r;
            const a = Gt(this, s, t);
            return (i = Math.max(i, t.currentTime)), a;
          });
          return (
            (t.currentTime = i), { type: 3, steps: o, options: pi(e.options) }
          );
        }
        visitAnimate(e, t) {
          const r = (function BU(n, e) {
            if (n.hasOwnProperty("duration")) return n;
            if ("number" == typeof n) return _p(Ou(n, e).duration, 0, "");
            const t = n;
            if (
              t
                .split(/\s+/)
                .some((o) => "{" == o.charAt(0) && "{" == o.charAt(1))
            ) {
              const o = _p(0, 0, "");
              return (o.dynamic = !0), (o.strValue = t), o;
            }
            const i = Ou(t, e);
            return _p(i.duration, i.delay, i.easing);
          })(e.timings, t.errors);
          t.currentAnimateTimings = r;
          let i,
            o = e.styles ? e.styles : h1({});
          if (5 == o.type) i = this.visitKeyframes(o, t);
          else {
            let s = e.styles,
              a = !1;
            if (!s) {
              a = !0;
              const u = {};
              r.easing && (u.easing = r.easing), (s = h1(u));
            }
            t.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, t);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (t.currentAnimateTimings = null),
            { type: 4, timings: r, style: i, options: null }
          );
        }
        visitStyle(e, t) {
          const r = this._makeStyleAst(e, t);
          return this._validateStyleAst(r, t), r;
        }
        _makeStyleAst(e, t) {
          const r = [],
            i = Array.isArray(e.styles) ? e.styles : [e.styles];
          for (let a of i)
            "string" == typeof a
              ? a === pr
                ? r.push(a)
                : t.errors.push(new T(3002, !1))
              : r.push(T1(a));
          let o = !1,
            s = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((s = a.get("easing")), a.delete("easing")),
                !o)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    o = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: s,
              offset: e.offset,
              containsDynamicStyles: o,
              options: null,
            }
          );
        }
        _validateStyleAst(e, t) {
          const r = t.currentAnimateTimings;
          let i = t.currentTime,
            o = t.currentTime;
          r && o > 0 && (o -= r.duration + r.delay),
            e.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const u = t.collectedStyles.get(t.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (o != i &&
                      o >= c.startTime &&
                      i <= c.endTime &&
                      (t.errors.push(
                        (function q$(n, e, t, r, i) {
                          return new T(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (o = c.startTime)),
                    d && u.set(l, { startTime: o, endTime: i }),
                    t.options &&
                      (function wU(n, e, t) {
                        const r = e.params || {},
                          i = R1(n);
                        i.length &&
                          i.forEach((o) => {
                            r.hasOwnProperty(o) ||
                              t.push(
                                (function V$(n) {
                                  return new T(3001, !1);
                                })()
                              );
                          });
                      })(a, t.options, t.errors);
                });
            });
        }
        visitKeyframes(e, t) {
          const r = { type: 5, styles: [], options: null };
          if (!t.currentAnimateTimings)
            return (
              t.errors.push(
                (function W$() {
                  return new T(3011, !1);
                })()
              ),
              r
            );
          let o = 0;
          const s = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = e.steps.map((w) => {
            const R = this._makeStyleAst(w, t);
            let S =
                null != R.offset
                  ? R.offset
                  : (function UU(n) {
                      if ("string" == typeof n) return null;
                      let e = null;
                      if (Array.isArray(n))
                        n.forEach((t) => {
                          if (t instanceof Map && t.has("offset")) {
                            const r = t;
                            (e = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (n instanceof Map && n.has("offset")) {
                        const t = n;
                        (e = parseFloat(t.get("offset"))), t.delete("offset");
                      }
                      return e;
                    })(R.styles),
              P = 0;
            return (
              null != S && (o++, (P = R.offset = S)),
              (l = l || P < 0 || P > 1),
              (a = a || P < u),
              (u = P),
              s.push(P),
              R
            );
          });
          l &&
            t.errors.push(
              (function K$() {
                return new T(3012, !1);
              })()
            ),
            a &&
              t.errors.push(
                (function Q$() {
                  return new T(3200, !1);
                })()
              );
          const d = e.steps.length;
          let p = 0;
          o > 0 && o < d
            ? t.errors.push(
                (function Y$() {
                  return new T(3202, !1);
                })()
              )
            : 0 == o && (p = 1 / (d - 1));
          const g = d - 1,
            m = t.currentTime,
            C = t.currentAnimateTimings,
            E = C.duration;
          return (
            c.forEach((w, R) => {
              const S = p > 0 ? (R == g ? 1 : p * R) : s[R],
                P = S * E;
              (t.currentTime = m + C.delay + P),
                (C.duration = P),
                this._validateStyleAst(w, t),
                (w.offset = S),
                r.styles.push(w);
            }),
            r
          );
        }
        visitReference(e, t) {
          return {
            type: 8,
            animation: Gt(this, _a(e.animation), t),
            options: pi(e.options),
          };
        }
        visitAnimateChild(e, t) {
          return t.depCount++, { type: 9, options: pi(e.options) };
        }
        visitAnimateRef(e, t) {
          return {
            type: 10,
            animation: this.visitReference(e.animation, t),
            options: pi(e.options),
          };
        }
        visitQuery(e, t) {
          const r = t.currentQuerySelector,
            i = e.options || {};
          t.queryCount++, (t.currentQuery = e);
          const [o, s] = (function LU(n) {
            const e = !!n.split(/\s*,\s*/).find((t) => ":self" == t);
            return (
              e && (n = n.replace(kU, "")),
              (n = n
                .replace(/@\*/g, ku)
                .replace(/@\w+/g, (t) => ku + "-" + t.slice(1))
                .replace(/:animating/g, fp)),
              [n, e]
            );
          })(e.selector);
          (t.currentQuerySelector = r.length ? r + " " + o : o),
            Ht(t.collectedStyles, t.currentQuerySelector, new Map());
          const a = Gt(this, _a(e.animation), t);
          return (
            (t.currentQuery = null),
            (t.currentQuerySelector = r),
            {
              type: 11,
              selector: o,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: s,
              animation: a,
              originalSelector: e.selector,
              options: pi(e.options),
            }
          );
        }
        visitStagger(e, t) {
          t.currentQuery ||
            t.errors.push(
              (function X$() {
                return new T(3013, !1);
              })()
            );
          const r =
            "full" === e.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : Ou(e.timings, t.errors, !0);
          return {
            type: 12,
            animation: Gt(this, _a(e.animation), t),
            timings: r,
            options: null,
          };
        }
      }
      class $U {
        constructor(e) {
          (this.errors = e),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function pi(n) {
        return (
          n
            ? (n = ma(n)).params &&
              (n.params = (function VU(n) {
                return n ? ma(n) : null;
              })(n.params))
            : (n = {}),
          n
        );
      }
      function _p(n, e, t) {
        return { duration: n, delay: e, easing: t };
      }
      function yp(n, e, t, r, i, o, s = null, a = !1) {
        return {
          type: 1,
          element: n,
          keyframes: e,
          preStyleProps: t,
          postStyleProps: r,
          duration: i,
          delay: o,
          totalTime: i + o,
          easing: s,
          subTimeline: a,
        };
      }
      class Hu {
        constructor() {
          this._map = new Map();
        }
        get(e) {
          return this._map.get(e) || [];
        }
        append(e, t) {
          let r = this._map.get(e);
          r || this._map.set(e, (r = [])), r.push(...t);
        }
        has(e) {
          return this._map.has(e);
        }
        clear() {
          this._map.clear();
        }
      }
      const GU = new RegExp(":enter", "g"),
        qU = new RegExp(":leave", "g");
      function vp(n, e, t, r, i, o = new Map(), s = new Map(), a, l, u = []) {
        return new WU().buildKeyframes(n, e, t, r, i, o, s, a, l, u);
      }
      class WU {
        buildKeyframes(e, t, r, i, o, s, a, l, u, c = []) {
          u = u || new Hu();
          const d = new Cp(e, t, u, i, o, c, []);
          d.options = l;
          const p = l.delay ? gr(l.delay) : 0;
          d.currentTimeline.delayNextStep(p),
            d.currentTimeline.setStyles([s], null, d.errors, l),
            Gt(this, r, d);
          const g = d.timelines.filter((m) => m.containsAnimation());
          if (g.length && a.size) {
            let m;
            for (let C = g.length - 1; C >= 0; C--) {
              const E = g[C];
              if (E.element === t) {
                m = E;
                break;
              }
            }
            m &&
              !m.allowOnlyTimelineStyles() &&
              m.setStyles([a], null, d.errors, l);
          }
          return g.length
            ? g.map((m) => m.buildKeyframes())
            : [yp(t, [], [], [], 0, p, "", !1)];
        }
        visitTrigger(e, t) {}
        visitState(e, t) {}
        visitTransition(e, t) {}
        visitAnimateChild(e, t) {
          const r = t.subInstructions.get(t.element);
          if (r) {
            const i = t.createSubContext(e.options),
              o = t.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, i, i.options);
            o != s && t.transformIntoNewTimeline(s);
          }
          t.previousNode = e;
        }
        visitAnimateRef(e, t) {
          const r = t.createSubContext(e.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [e.options, e.animation.options],
              t,
              r
            ),
            this.visitReference(e.animation, r),
            t.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (t.previousNode = e);
        }
        _applyAnimationRefDelays(e, t, r) {
          for (const i of e) {
            const o = i?.delay;
            if (o) {
              const s =
                "number" == typeof o ? o : gr(ya(o, i?.params ?? {}, t.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(e, t, r) {
          let o = t.currentTimeline.currentTime;
          const s = null != r.duration ? gr(r.duration) : null,
            a = null != r.delay ? gr(r.delay) : null;
          return (
            0 !== s &&
              e.forEach((l) => {
                const u = t.appendInstructionToTimeline(l, s, a);
                o = Math.max(o, u.duration + u.delay);
              }),
            o
          );
        }
        visitReference(e, t) {
          t.updateOptions(e.options, !0),
            Gt(this, e.animation, t),
            (t.previousNode = e);
        }
        visitSequence(e, t) {
          const r = t.subContextCount;
          let i = t;
          const o = e.options;
          if (
            o &&
            (o.params || o.delay) &&
            ((i = t.createSubContext(o)),
            i.transformIntoNewTimeline(),
            null != o.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = Gu));
            const s = gr(o.delay);
            i.delayNextStep(s);
          }
          e.steps.length &&
            (e.steps.forEach((s) => Gt(this, s, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (t.previousNode = e);
        }
        visitGroup(e, t) {
          const r = [];
          let i = t.currentTimeline.currentTime;
          const o = e.options && e.options.delay ? gr(e.options.delay) : 0;
          e.steps.forEach((s) => {
            const a = t.createSubContext(e.options);
            o && a.delayNextStep(o),
              Gt(this, s, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((s) => t.currentTimeline.mergeTimelineCollectedStyles(s)),
            t.transformIntoNewTimeline(i),
            (t.previousNode = e);
        }
        _visitTiming(e, t) {
          if (e.dynamic) {
            const r = e.strValue;
            return Ou(t.params ? ya(r, t.params, t.errors) : r, t.errors);
          }
          return { duration: e.duration, delay: e.delay, easing: e.easing };
        }
        visitAnimate(e, t) {
          const r = (t.currentAnimateTimings = this._visitTiming(e.timings, t)),
            i = t.currentTimeline;
          r.delay && (t.incrementTime(r.delay), i.snapshotCurrentStyles());
          const o = e.style;
          5 == o.type
            ? this.visitKeyframes(o, t)
            : (t.incrementTime(r.duration),
              this.visitStyle(o, t),
              i.applyStylesToKeyframe()),
            (t.currentAnimateTimings = null),
            (t.previousNode = e);
        }
        visitStyle(e, t) {
          const r = t.currentTimeline,
            i = t.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const o = (i && i.easing) || e.easing;
          e.isEmptyStep
            ? r.applyEmptyStep(o)
            : r.setStyles(e.styles, o, t.errors, t.options),
            (t.previousNode = e);
        }
        visitKeyframes(e, t) {
          const r = t.currentAnimateTimings,
            i = t.currentTimeline.duration,
            o = r.duration,
            a = t.createSubContext().currentTimeline;
          (a.easing = r.easing),
            e.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * o),
                a.setStyles(l.styles, l.easing, t.errors, t.options),
                a.applyStylesToKeyframe();
            }),
            t.currentTimeline.mergeTimelineCollectedStyles(a),
            t.transformIntoNewTimeline(i + o),
            (t.previousNode = e);
        }
        visitQuery(e, t) {
          const r = t.currentTimeline.currentTime,
            i = e.options || {},
            o = i.delay ? gr(i.delay) : 0;
          o &&
            (6 === t.previousNode.type ||
              (0 == r && t.currentTimeline.hasCurrentStyleProperties())) &&
            (t.currentTimeline.snapshotCurrentStyles(), (t.previousNode = Gu));
          let s = r;
          const a = t.invokeQuery(
            e.selector,
            e.originalSelector,
            e.limit,
            e.includeSelf,
            !!i.optional,
            t.errors
          );
          t.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            t.currentQueryIndex = c;
            const d = t.createSubContext(e.options, u);
            o && d.delayNextStep(o),
              u === t.element && (l = d.currentTimeline),
              Gt(this, e.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (t.currentQueryIndex = 0),
            (t.currentQueryTotal = 0),
            t.transformIntoNewTimeline(s),
            l &&
              (t.currentTimeline.mergeTimelineCollectedStyles(l),
              t.currentTimeline.snapshotCurrentStyles()),
            (t.previousNode = e);
        }
        visitStagger(e, t) {
          const r = t.parentContext,
            i = t.currentTimeline,
            o = e.timings,
            s = Math.abs(o.duration),
            a = s * (t.currentQueryTotal - 1);
          let l = s * t.currentQueryIndex;
          switch (o.duration < 0 ? "reverse" : o.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const c = t.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          Gt(this, e.animation, t),
            (t.previousNode = e),
            (r.currentStaggerTime =
              i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const Gu = {};
      class Cp {
        constructor(e, t, r, i, o, s, a, l) {
          (this._driver = e),
            (this.element = t),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = o),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Gu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new zu(this._driver, t, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(e, t) {
          if (!e) return;
          const r = e;
          let i = this.options;
          null != r.duration && (i.duration = gr(r.duration)),
            null != r.delay && (i.delay = gr(r.delay));
          const o = r.params;
          if (o) {
            let s = i.params;
            s || (s = this.options.params = {}),
              Object.keys(o).forEach((a) => {
                (!t || !s.hasOwnProperty(a)) &&
                  (s[a] = ya(o[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const e = {};
          if (this.options) {
            const t = this.options.params;
            if (t) {
              const r = (e.params = {});
              Object.keys(t).forEach((i) => {
                r[i] = t[i];
              });
            }
          }
          return e;
        }
        createSubContext(e = null, t, r) {
          const i = t || this.element,
            o = new Cp(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0)
            );
          return (
            (o.previousNode = this.previousNode),
            (o.currentAnimateTimings = this.currentAnimateTimings),
            (o.options = this._copyOptions()),
            o.updateOptions(e),
            (o.currentQueryIndex = this.currentQueryIndex),
            (o.currentQueryTotal = this.currentQueryTotal),
            (o.parentContext = this),
            this.subContextCount++,
            o
          );
        }
        transformIntoNewTimeline(e) {
          return (
            (this.previousNode = Gu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(e, t, r) {
          const i = {
              duration: t ?? e.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
              easing: "",
            },
            o = new KU(
              this._driver,
              e.element,
              e.keyframes,
              e.preStyleProps,
              e.postStyleProps,
              i,
              e.stretchStartingKeyframe
            );
          return this.timelines.push(o), i;
        }
        incrementTime(e) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
        }
        delayNextStep(e) {
          e > 0 && this.currentTimeline.delayNextStep(e);
        }
        invokeQuery(e, t, r, i, o, s) {
          let a = [];
          if ((i && a.push(this.element), e.length > 0)) {
            e = (e = e.replace(GU, "." + this._enterClassName)).replace(
              qU,
              "." + this._leaveClassName
            );
            let u = this._driver.query(this.element, e, 1 != r);
            0 !== r &&
              (u = r < 0 ? u.slice(u.length + r, u.length) : u.slice(0, r)),
              a.push(...u);
          }
          return (
            !o &&
              0 == a.length &&
              s.push(
                (function Z$(n) {
                  return new T(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class zu {
        constructor(e, t, r, i) {
          (this._driver = e),
            (this.element = t),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(t)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                t,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(e) {
          const t = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || t
            ? (this.forwardTime(this.currentTime + e),
              t && this.snapshotCurrentStyles())
            : (this.startTime += e);
        }
        fork(e, t) {
          return (
            this.applyStylesToKeyframe(),
            new zu(
              this._driver,
              e,
              t || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(e) {
          this.applyStylesToKeyframe(),
            (this.duration = e),
            this._loadKeyframe();
        }
        _updateStyle(e, t) {
          this._localTimelineStyles.set(e, t),
            this._globalTimelineStyles.set(e, t),
            this._styleSummary.set(e, { time: this.currentTime, value: t });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(e) {
          e && this._previousKeyframe.set("easing", e);
          for (let [t, r] of this._globalTimelineStyles)
            this._backFill.set(t, r || pr), this._currentKeyframe.set(t, pr);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(e, t, r, i) {
          t && this._previousKeyframe.set("easing", t);
          const o = (i && i.params) || {},
            s = (function QU(n, e) {
              const t = new Map();
              let r;
              return (
                n.forEach((i) => {
                  if ("*" === i) {
                    r = r || e.keys();
                    for (let o of r) t.set(o, pr);
                  } else Vr(i, t);
                }),
                t
              );
            })(e, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const u = ya(l, o, r);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? pr),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((e, t) => {
              this._currentKeyframe.set(t, e);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((e, t) => {
              this._currentKeyframe.has(t) || this._currentKeyframe.set(t, e);
            }));
        }
        snapshotCurrentStyles() {
          for (let [e, t] of this._localTimelineStyles)
            this._pendingStyles.set(e, t), this._updateStyle(e, t);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const e = [];
          for (let t in this._currentKeyframe) e.push(t);
          return e;
        }
        mergeTimelineCollectedStyles(e) {
          e._styleSummary.forEach((t, r) => {
            const i = this._styleSummary.get(r);
            (!i || t.time > i.time) && this._updateStyle(r, t.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const e = new Set(),
            t = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const u = Vr(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              "!" === c ? e.add(d) : c === pr && t.add(d);
            }),
              r || u.set("offset", l / this.duration),
              i.push(u);
          });
          const o = e.size ? Lu(e.values()) : [],
            s = t.size ? Lu(t.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return yp(
            this.element,
            i,
            o,
            s,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class KU extends zu {
        constructor(e, t, r, i, o, s, a = !1) {
          super(e, t, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = o),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: s.duration,
              delay: s.delay,
              easing: s.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let e = this.keyframes,
            { delay: t, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && t) {
            const o = [],
              s = r + t,
              a = t / s,
              l = Vr(e[0]);
            l.set("offset", 0), o.push(l);
            const u = Vr(e[0]);
            u.set("offset", O1(a)), o.push(u);
            const c = e.length - 1;
            for (let d = 1; d <= c; d++) {
              let p = Vr(e[d]);
              const g = p.get("offset");
              p.set("offset", O1((t + g * r) / s)), o.push(p);
            }
            (r = s), (t = 0), (i = ""), (e = o);
          }
          return yp(
            this.element,
            e,
            this.preStyleProps,
            this.postStyleProps,
            r,
            t,
            i,
            !0
          );
        }
      }
      function O1(n, e = 3) {
        const t = Math.pow(10, e - 1);
        return Math.round(n * t) / t;
      }
      class Dp {}
      const YU = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class XU extends Dp {
        normalizePropertyName(e, t) {
          return gp(e);
        }
        normalizeStyleValue(e, t, r, i) {
          let o = "";
          const s = r.toString().trim();
          if (YU.has(t) && 0 !== r && "0" !== r)
            if ("number" == typeof r) o = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function B$(n, e) {
                    return new T(3005, !1);
                  })()
                );
            }
          return s + o;
        }
      }
      function L1(n, e, t, r, i, o, s, a, l, u, c, d, p) {
        return {
          type: 0,
          element: n,
          triggerName: e,
          isRemovalTransition: i,
          fromState: t,
          fromStyles: o,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: p,
        };
      }
      const bp = {};
      class V1 {
        constructor(e, t, r) {
          (this._triggerName = e), (this.ast = t), (this._stateStyles = r);
        }
        match(e, t, r, i) {
          return (function ZU(n, e, t, r, i) {
            return n.some((o) => o(e, t, r, i));
          })(this.ast.matchers, e, t, r, i);
        }
        buildStyles(e, t, r) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== e && (i = this._stateStyles.get(e?.toString()) || i),
            i ? i.buildStyles(t, r) : new Map()
          );
        }
        build(e, t, r, i, o, s, a, l, u, c) {
          const d = [],
            p = (this.ast.options && this.ast.options.params) || bp,
            m = this.buildStyles(r, (a && a.params) || bp, d),
            C = (l && l.params) || bp,
            E = this.buildStyles(i, C, d),
            w = new Set(),
            R = new Map(),
            S = new Map(),
            P = "void" === i,
            ce = { params: JU(C, p), delay: this.ast.options?.delay },
            pe = c ? [] : vp(e, t, this.ast.animation, o, s, m, E, ce, u, d);
          let yt = 0;
          if (
            (pe.forEach((_r) => {
              yt = Math.max(_r.duration + _r.delay, yt);
            }),
            d.length)
          )
            return L1(t, this._triggerName, r, i, P, m, E, [], [], R, S, yt, d);
          pe.forEach((_r) => {
            const yr = _r.element,
              J1 = Ht(R, yr, new Set());
            _r.preStyleProps.forEach((gi) => J1.add(gi));
            const Ca = Ht(S, yr, new Set());
            _r.postStyleProps.forEach((gi) => Ca.add(gi)),
              yr !== t && w.add(yr);
          });
          const mr = Lu(w.values());
          return L1(t, this._triggerName, r, i, P, m, E, pe, mr, R, S, yt);
        }
      }
      function JU(n, e) {
        const t = ma(e);
        for (const r in n) n.hasOwnProperty(r) && null != n[r] && (t[r] = n[r]);
        return t;
      }
      class eB {
        constructor(e, t, r) {
          (this.styles = e), (this.defaultParams = t), (this.normalizer = r);
        }
        buildStyles(e, t) {
          const r = new Map(),
            i = ma(this.defaultParams);
          return (
            Object.keys(e).forEach((o) => {
              const s = e[o];
              null !== s && (i[o] = s);
            }),
            this.styles.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((s, a) => {
                  s && (s = ya(s, i, t));
                  const l = this.normalizer.normalizePropertyName(a, t);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, t)),
                    r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class nB {
        constructor(e, t, r) {
          (this.name = e),
            (this.ast = t),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            t.states.forEach((i) => {
              this.states.set(
                i.name,
                new eB(i.style, (i.options && i.options.params) || {}, r)
              );
            }),
            $1(this.states, "true", "1"),
            $1(this.states, "false", "0"),
            t.transitions.forEach((i) => {
              this.transitionFactories.push(new V1(e, i, this.states));
            }),
            (this.fallbackTransition = (function rB(n, e, t) {
              return new V1(
                n,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                e
              );
            })(e, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(e, t, r, i) {
          return (
            this.transitionFactories.find((s) => s.match(e, t, r, i)) || null
          );
        }
        matchStyles(e, t, r) {
          return this.fallbackTransition.buildStyles(e, t, r);
        }
      }
      function $1(n, e, t) {
        n.has(e)
          ? n.has(t) || n.set(t, n.get(e))
          : n.has(t) && n.set(e, n.get(t));
      }
      const iB = new Hu();
      class oB {
        constructor(e, t, r) {
          (this.bodyNode = e),
            (this._driver = t),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(e, t) {
          const r = [],
            o = mp(this._driver, t, r, []);
          if (r.length)
            throw (function oU(n) {
              return new T(3503, !1);
            })();
          this._animations.set(e, o);
        }
        _buildPlayer(e, t, r) {
          const i = e.element,
            o = _1(0, this._normalizer, 0, e.keyframes, t, r);
          return this._driver.animate(
            i,
            o,
            e.duration,
            e.delay,
            e.easing,
            [],
            !0
          );
        }
        create(e, t, r = {}) {
          const i = [],
            o = this._animations.get(e);
          let s;
          const a = new Map();
          if (
            (o
              ? ((s = vp(
                  this._driver,
                  t,
                  o,
                  dp,
                  Fu,
                  new Map(),
                  new Map(),
                  r,
                  iB,
                  i
                )),
                s.forEach((c) => {
                  const d = Ht(a, c.element, new Map());
                  c.postStyleProps.forEach((p) => d.set(p, null));
                }))
              : (i.push(
                  (function sU() {
                    return new T(3300, !1);
                  })()
                ),
                (s = [])),
            i.length)
          )
            throw (function aU(n) {
              return new T(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((p, g) => {
              c.set(g, this._driver.computeStyle(d, g, pr));
            });
          });
          const u = Lr(
            s.map((c) => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return (
            this._playersById.set(e, u),
            u.onDestroy(() => this.destroy(e)),
            this.players.push(u),
            u
          );
        }
        destroy(e) {
          const t = this._getPlayer(e);
          t.destroy(), this._playersById.delete(e);
          const r = this.players.indexOf(t);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(e) {
          const t = this._playersById.get(e);
          if (!t)
            throw (function lU(n) {
              return new T(3301, !1);
            })();
          return t;
        }
        listen(e, t, r, i) {
          const o = ap(t, "", "", "");
          return op(this._getPlayer(e), r, o, i), () => {};
        }
        command(e, t, r, i) {
          if ("register" == r) return void this.register(e, i[0]);
          if ("create" == r) return void this.create(e, t, i[0] || {});
          const o = this._getPlayer(e);
          switch (r) {
            case "play":
              o.play();
              break;
            case "pause":
              o.pause();
              break;
            case "reset":
              o.reset();
              break;
            case "restart":
              o.restart();
              break;
            case "finish":
              o.finish();
              break;
            case "init":
              o.init();
              break;
            case "setPosition":
              o.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(e);
          }
        }
      }
      const U1 = "ng-animate-queued",
        Ep = "ng-animate-disabled",
        cB = [],
        B1 = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        dB = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        ln = "__ng_removed";
      class wp {
        get params() {
          return this.options.params;
        }
        constructor(e, t = "") {
          this.namespaceId = t;
          const r = e && e.hasOwnProperty("value");
          if (
            ((this.value = (function gB(n) {
              return n ?? null;
            })(r ? e.value : e)),
            r)
          ) {
            const o = ma(e);
            delete o.value, (this.options = o);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(e) {
          const t = e.params;
          if (t) {
            const r = this.options.params;
            Object.keys(t).forEach((i) => {
              null == r[i] && (r[i] = t[i]);
            });
          }
        }
      }
      const va = "void",
        Sp = new wp(va);
      class fB {
        constructor(e, t, r) {
          (this.id = e),
            (this.hostElement = t),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + e),
            un(t, this._hostClassName);
        }
        listen(e, t, r, i) {
          if (!this._triggers.has(t))
            throw (function uU(n, e) {
              return new T(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function cU(n) {
              return new T(3303, !1);
            })();
          if (
            !(function mB(n) {
              return "start" == n || "done" == n;
            })(r)
          )
            throw (function dU(n, e) {
              return new T(3400, !1);
            })();
          const o = Ht(this._elementListeners, e, []),
            s = { name: t, phase: r, callback: i };
          o.push(s);
          const a = Ht(this._engine.statesByElement, e, new Map());
          return (
            a.has(t) || (un(e, Pu), un(e, Pu + "-" + t), a.set(t, Sp)),
            () => {
              this._engine.afterFlush(() => {
                const l = o.indexOf(s);
                l >= 0 && o.splice(l, 1), this._triggers.has(t) || a.delete(t);
              });
            }
          );
        }
        register(e, t) {
          return !this._triggers.has(e) && (this._triggers.set(e, t), !0);
        }
        _getTrigger(e) {
          const t = this._triggers.get(e);
          if (!t)
            throw (function fU(n) {
              return new T(3401, !1);
            })();
          return t;
        }
        trigger(e, t, r, i = !0) {
          const o = this._getTrigger(t),
            s = new Mp(this.id, t, e);
          let a = this._engine.statesByElement.get(e);
          a ||
            (un(e, Pu),
            un(e, Pu + "-" + t),
            this._engine.statesByElement.set(e, (a = new Map())));
          let l = a.get(t);
          const u = new wp(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              u.absorbOptions(l.options),
            a.set(t, u),
            l || (l = Sp),
            u.value !== va && l.value === u.value)
          ) {
            if (
              !(function vB(n, e) {
                const t = Object.keys(n),
                  r = Object.keys(e);
                if (t.length != r.length) return !1;
                for (let i = 0; i < t.length; i++) {
                  const o = t[i];
                  if (!e.hasOwnProperty(o) || n[o] !== e[o]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const C = [],
                E = o.matchStyles(l.value, l.params, C),
                w = o.matchStyles(u.value, u.params, C);
              C.length
                ? this._engine.reportError(C)
                : this._engine.afterFlush(() => {
                    hi(e, E), Wn(e, w);
                  });
            }
            return;
          }
          const p = Ht(this._engine.playersByElement, e, []);
          p.forEach((C) => {
            C.namespaceId == this.id &&
              C.triggerName == t &&
              C.queued &&
              C.destroy();
          });
          let g = o.matchTransition(l.value, u.value, e, u.params),
            m = !1;
          if (!g) {
            if (!i) return;
            (g = o.fallbackTransition), (m = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: t,
              transition: g,
              fromState: l,
              toState: u,
              player: s,
              isFallbackTransition: m,
            }),
            m ||
              (un(e, U1),
              s.onStart(() => {
                Eo(e, U1);
              })),
            s.onDone(() => {
              let C = this.players.indexOf(s);
              C >= 0 && this.players.splice(C, 1);
              const E = this._engine.playersByElement.get(e);
              if (E) {
                let w = E.indexOf(s);
                w >= 0 && E.splice(w, 1);
              }
            }),
            this.players.push(s),
            p.push(s),
            s
          );
        }
        deregister(e) {
          this._triggers.delete(e),
            this._engine.statesByElement.forEach((t) => t.delete(e)),
            this._elementListeners.forEach((t, r) => {
              this._elementListeners.set(
                r,
                t.filter((i) => i.name != e)
              );
            });
        }
        clearElementCache(e) {
          this._engine.statesByElement.delete(e),
            this._elementListeners.delete(e);
          const t = this._engine.playersByElement.get(e);
          t &&
            (t.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(e));
        }
        _signalRemovalForInnerTriggers(e, t) {
          const r = this._engine.driver.query(e, ku, !0);
          r.forEach((i) => {
            if (i[ln]) return;
            const o = this._engine.fetchNamespacesByElement(i);
            o.size
              ? o.forEach((s) => s.triggerLeaveAnimation(i, t, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((i) => this.clearElementCache(i))
            );
        }
        triggerLeaveAnimation(e, t, r, i) {
          const o = this._engine.statesByElement.get(e),
            s = new Map();
          if (o) {
            const a = [];
            if (
              (o.forEach((l, u) => {
                if ((s.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(e, u, va, i);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, e, !0, t, s),
                r && Lr(a).onDone(() => this._engine.processLeaveNode(e)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(e) {
          const t = this._elementListeners.get(e),
            r = this._engine.statesByElement.get(e);
          if (t && r) {
            const i = new Set();
            t.forEach((o) => {
              const s = o.name;
              if (i.has(s)) return;
              i.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                u = r.get(s) || Sp,
                c = new wp(va),
                d = new Mp(this.id, s, e);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: e,
                  triggerName: s,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(e, t) {
          const r = this._engine;
          if (
            (e.childElementCount && this._signalRemovalForInnerTriggers(e, t),
            this.triggerLeaveAnimation(e, t, !0))
          )
            return;
          let i = !1;
          if (r.totalAnimations) {
            const o = r.players.length ? r.playersByQueriedElement.get(e) : [];
            if (o && o.length) i = !0;
            else {
              let s = e;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(e), i))
            r.markElementAsRemoved(this.id, e, !1, t);
          else {
            const o = e[ln];
            (!o || o === B1) &&
              (r.afterFlush(() => this.clearElementCache(e)),
              r.destroyInnerAnimations(e),
              r._onRemovalComplete(e, t));
          }
        }
        insertNode(e, t) {
          un(e, this._hostClassName);
        }
        drainQueuedTransitions(e) {
          const t = [];
          return (
            this._queue.forEach((r) => {
              const i = r.player;
              if (i.destroyed) return;
              const o = r.element,
                s = this._elementListeners.get(o);
              s &&
                s.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = ap(
                      o,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value
                    );
                    (l._data = e), op(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : t.push(r);
            }),
            (this._queue = []),
            t.sort((r, i) => {
              const o = r.transition.ast.depCount,
                s = i.transition.ast.depCount;
              return 0 == o || 0 == s
                ? o - s
                : this._engine.driver.containsElement(r.element, i.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(e) {
          this.players.forEach((t) => t.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, e);
        }
        elementContainsData(e) {
          let t = !1;
          return (
            this._elementListeners.has(e) && (t = !0),
            (t = !!this._queue.find((r) => r.element === e) || t),
            t
          );
        }
      }
      class hB {
        _onRemovalComplete(e, t) {
          this.onRemovalComplete(e, t);
        }
        constructor(e, t, r) {
          (this.bodyNode = e),
            (this.driver = t),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, o) => {});
        }
        get queuedPlayers() {
          const e = [];
          return (
            this._namespaceList.forEach((t) => {
              t.players.forEach((r) => {
                r.queued && e.push(r);
              });
            }),
            e
          );
        }
        createNamespace(e, t) {
          const r = new fB(e, t, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, t)
              ? this._balanceNamespaceList(r, t)
              : (this.newHostElements.set(t, r), this.collectEnterElement(t)),
            (this._namespaceLookup[e] = r)
          );
        }
        _balanceNamespaceList(e, t) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(t);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const u = r.indexOf(l);
                r.splice(u + 1, 0, e), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(e);
          } else r.push(e);
          return i.set(t, e), e;
        }
        register(e, t) {
          let r = this._namespaceLookup[e];
          return r || (r = this.createNamespace(e, t)), r;
        }
        registerTrigger(e, t, r) {
          let i = this._namespaceLookup[e];
          i && i.register(t, r) && this.totalAnimations++;
        }
        destroy(e, t) {
          if (!e) return;
          const r = this._fetchNamespace(e);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[e];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(t));
        }
        _fetchNamespace(e) {
          return this._namespaceLookup[e];
        }
        fetchNamespacesByElement(e) {
          const t = new Set(),
            r = this.statesByElement.get(e);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const o = this._fetchNamespace(i.namespaceId);
                o && t.add(o);
              }
          return t;
        }
        trigger(e, t, r, i) {
          if (qu(t)) {
            const o = this._fetchNamespace(e);
            if (o) return o.trigger(t, r, i), !0;
          }
          return !1;
        }
        insertNode(e, t, r, i) {
          if (!qu(t)) return;
          const o = t[ln];
          if (o && o.setForRemoval) {
            (o.setForRemoval = !1), (o.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(t);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (e) {
            const s = this._fetchNamespace(e);
            s && s.insertNode(t, r);
          }
          i && this.collectEnterElement(t);
        }
        collectEnterElement(e) {
          this.collectedEnterElements.push(e);
        }
        markElementAsDisabled(e, t) {
          t
            ? this.disabledNodes.has(e) ||
              (this.disabledNodes.add(e), un(e, Ep))
            : this.disabledNodes.has(e) &&
              (this.disabledNodes.delete(e), Eo(e, Ep));
        }
        removeNode(e, t, r, i) {
          if (qu(t)) {
            const o = e ? this._fetchNamespace(e) : null;
            if (
              (o ? o.removeNode(t, i) : this.markElementAsRemoved(e, t, !1, i),
              r)
            ) {
              const s = this.namespacesByHostElement.get(t);
              s && s.id !== e && s.removeNode(t, i);
            }
          } else this._onRemovalComplete(t, i);
        }
        markElementAsRemoved(e, t, r, i, o) {
          this.collectedLeaveElements.push(t),
            (t[ln] = {
              namespaceId: e,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: o,
            });
        }
        listen(e, t, r, i, o) {
          return qu(t) ? this._fetchNamespace(e).listen(t, r, i, o) : () => {};
        }
        _buildInstruction(e, t, r, i, o) {
          return e.transition.build(
            this.driver,
            e.element,
            e.fromState.value,
            e.toState.value,
            r,
            i,
            e.fromState.options,
            e.toState.options,
            t,
            o
          );
        }
        destroyInnerAnimations(e) {
          let t = this.driver.query(e, ku, !0);
          t.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((t = this.driver.query(e, fp, !0)),
              t.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(e) {
          const t = this.playersByElement.get(e);
          t &&
            t.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(e) {
          const t = this.playersByQueriedElement.get(e);
          t && t.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((e) => {
            if (this.players.length) return Lr(this.players).onDone(() => e());
            e();
          });
        }
        processLeaveNode(e) {
          const t = e[ln];
          if (t && t.setForRemoval) {
            if (((e[ln] = B1), t.namespaceId)) {
              this.destroyInnerAnimations(e);
              const r = this._fetchNamespace(t.namespaceId);
              r && r.clearElementCache(e);
            }
            this._onRemovalComplete(e, t.setForRemoval);
          }
          e.classList?.contains(Ep) && this.markElementAsDisabled(e, !1),
            this.driver.query(e, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(e = -1) {
          let t = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) =>
                this._balanceNamespaceList(r, i)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              un(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              t = this._flushAnimations(r, e);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              t.length
                ? Lr(t).onDone(() => {
                    r.forEach((i) => i());
                  })
                : r.forEach((i) => i());
          }
        }
        reportError(e) {
          throw (function hU(n) {
            return new T(3402, !1);
          })();
        }
        _flushAnimations(e, t) {
          const r = new Hu(),
            i = [],
            o = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach((L) => {
            c.add(L);
            const j = this.driver.query(L, ".ng-animate-queued", !0);
            for (let Q = 0; Q < j.length; Q++) c.add(j[Q]);
          });
          const d = this.bodyNode,
            p = Array.from(this.statesByElement.keys()),
            g = G1(p, this.collectedEnterElements),
            m = new Map();
          let C = 0;
          g.forEach((L, j) => {
            const Q = dp + C++;
            m.set(j, Q), L.forEach((fe) => un(fe, Q));
          });
          const E = [],
            w = new Set(),
            R = new Set();
          for (let L = 0; L < this.collectedLeaveElements.length; L++) {
            const j = this.collectedLeaveElements[L],
              Q = j[ln];
            Q &&
              Q.setForRemoval &&
              (E.push(j),
              w.add(j),
              Q.hasAnimation
                ? this.driver
                    .query(j, ".ng-star-inserted", !0)
                    .forEach((fe) => w.add(fe))
                : R.add(j));
          }
          const S = new Map(),
            P = G1(p, Array.from(w));
          P.forEach((L, j) => {
            const Q = Fu + C++;
            S.set(j, Q), L.forEach((fe) => un(fe, Q));
          }),
            e.push(() => {
              g.forEach((L, j) => {
                const Q = m.get(j);
                L.forEach((fe) => Eo(fe, Q));
              }),
                P.forEach((L, j) => {
                  const Q = S.get(j);
                  L.forEach((fe) => Eo(fe, Q));
                }),
                E.forEach((L) => {
                  this.processLeaveNode(L);
                });
            });
          const ce = [],
            pe = [];
          for (let L = this._namespaceList.length - 1; L >= 0; L--)
            this._namespaceList[L].drainQueuedTransitions(t).forEach((Q) => {
              const fe = Q.player,
                nt = Q.element;
              if ((ce.push(fe), this.collectedEnterElements.length)) {
                const vt = nt[ln];
                if (vt && vt.setForMove) {
                  if (
                    vt.previousTriggersValues &&
                    vt.previousTriggersValues.has(Q.triggerName)
                  ) {
                    const mi = vt.previousTriggersValues.get(Q.triggerName),
                      cn = this.statesByElement.get(Q.element);
                    if (cn && cn.has(Q.triggerName)) {
                      const Qu = cn.get(Q.triggerName);
                      (Qu.value = mi), cn.set(Q.triggerName, Qu);
                    }
                  }
                  return void fe.destroy();
                }
              }
              const Kn = !d || !this.driver.containsElement(d, nt),
                zt = S.get(nt),
                $r = m.get(nt),
                ke = this._buildInstruction(Q, r, $r, zt, Kn);
              if (ke.errors && ke.errors.length) return void pe.push(ke);
              if (Kn)
                return (
                  fe.onStart(() => hi(nt, ke.fromStyles)),
                  fe.onDestroy(() => Wn(nt, ke.toStyles)),
                  void i.push(fe)
                );
              if (Q.isFallbackTransition)
                return (
                  fe.onStart(() => hi(nt, ke.fromStyles)),
                  fe.onDestroy(() => Wn(nt, ke.toStyles)),
                  void i.push(fe)
                );
              const nw = [];
              ke.timelines.forEach((vt) => {
                (vt.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(vt.element) || nw.push(vt);
              }),
                (ke.timelines = nw),
                r.append(nt, ke.timelines),
                s.push({ instruction: ke, player: fe, element: nt }),
                ke.queriedElements.forEach((vt) => Ht(a, vt, []).push(fe)),
                ke.preStyleProps.forEach((vt, mi) => {
                  if (vt.size) {
                    let cn = l.get(mi);
                    cn || l.set(mi, (cn = new Set())),
                      vt.forEach((Qu, Ap) => cn.add(Ap));
                  }
                }),
                ke.postStyleProps.forEach((vt, mi) => {
                  let cn = u.get(mi);
                  cn || u.set(mi, (cn = new Set())),
                    vt.forEach((Qu, Ap) => cn.add(Ap));
                });
            });
          if (pe.length) {
            const L = [];
            pe.forEach((j) => {
              L.push(
                (function pU(n, e) {
                  return new T(3505, !1);
                })()
              );
            }),
              ce.forEach((j) => j.destroy()),
              this.reportError(L);
          }
          const yt = new Map(),
            mr = new Map();
          s.forEach((L) => {
            const j = L.element;
            r.has(j) &&
              (mr.set(j, j),
              this._beforeAnimationBuild(
                L.player.namespaceId,
                L.instruction,
                yt
              ));
          }),
            i.forEach((L) => {
              const j = L.element;
              this._getPreviousPlayers(
                j,
                !1,
                L.namespaceId,
                L.triggerName,
                null
              ).forEach((fe) => {
                Ht(yt, j, []).push(fe), fe.destroy();
              });
            });
          const _r = E.filter((L) => q1(L, l, u)),
            yr = new Map();
          H1(yr, this.driver, R, u, pr).forEach((L) => {
            q1(L, l, u) && _r.push(L);
          });
          const Ca = new Map();
          g.forEach((L, j) => {
            H1(Ca, this.driver, new Set(L), l, "!");
          }),
            _r.forEach((L) => {
              const j = yr.get(L),
                Q = Ca.get(L);
              yr.set(
                L,
                new Map([
                  ...Array.from(j?.entries() ?? []),
                  ...Array.from(Q?.entries() ?? []),
                ])
              );
            });
          const gi = [],
            ew = [],
            tw = {};
          s.forEach((L) => {
            const { element: j, player: Q, instruction: fe } = L;
            if (r.has(j)) {
              if (c.has(j))
                return (
                  Q.onDestroy(() => Wn(j, fe.toStyles)),
                  (Q.disabled = !0),
                  Q.overrideTotalTime(fe.totalTime),
                  void i.push(Q)
                );
              let nt = tw;
              if (mr.size > 1) {
                let zt = j;
                const $r = [];
                for (; (zt = zt.parentNode); ) {
                  const ke = mr.get(zt);
                  if (ke) {
                    nt = ke;
                    break;
                  }
                  $r.push(zt);
                }
                $r.forEach((ke) => mr.set(ke, nt));
              }
              const Kn = this._buildAnimation(Q.namespaceId, fe, yt, o, Ca, yr);
              if ((Q.setRealPlayer(Kn), nt === tw)) gi.push(Q);
              else {
                const zt = this.playersByElement.get(nt);
                zt && zt.length && (Q.parentPlayer = Lr(zt)), i.push(Q);
              }
            } else
              hi(j, fe.fromStyles),
                Q.onDestroy(() => Wn(j, fe.toStyles)),
                ew.push(Q),
                c.has(j) && i.push(Q);
          }),
            ew.forEach((L) => {
              const j = o.get(L.element);
              if (j && j.length) {
                const Q = Lr(j);
                L.setRealPlayer(Q);
              }
            }),
            i.forEach((L) => {
              L.parentPlayer ? L.syncPlayerEvents(L.parentPlayer) : L.destroy();
            });
          for (let L = 0; L < E.length; L++) {
            const j = E[L],
              Q = j[ln];
            if ((Eo(j, Fu), Q && Q.hasAnimation)) continue;
            let fe = [];
            if (a.size) {
              let Kn = a.get(j);
              Kn && Kn.length && fe.push(...Kn);
              let zt = this.driver.query(j, fp, !0);
              for (let $r = 0; $r < zt.length; $r++) {
                let ke = a.get(zt[$r]);
                ke && ke.length && fe.push(...ke);
              }
            }
            const nt = fe.filter((Kn) => !Kn.destroyed);
            nt.length ? _B(this, j, nt) : this.processLeaveNode(j);
          }
          return (
            (E.length = 0),
            gi.forEach((L) => {
              this.players.push(L),
                L.onDone(() => {
                  L.destroy();
                  const j = this.players.indexOf(L);
                  this.players.splice(j, 1);
                }),
                L.play();
            }),
            gi
          );
        }
        elementContainsData(e, t) {
          let r = !1;
          const i = t[ln];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(t) && (r = !0),
            this.playersByQueriedElement.has(t) && (r = !0),
            this.statesByElement.has(t) && (r = !0),
            this._fetchNamespace(e).elementContainsData(t) || r
          );
        }
        afterFlush(e) {
          this._flushFns.push(e);
        }
        afterFlushAnimationsDone(e) {
          this._whenQuietFns.push(e);
        }
        _getPreviousPlayers(e, t, r, i, o) {
          let s = [];
          if (t) {
            const a = this.playersByQueriedElement.get(e);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(e);
            if (a) {
              const l = !o || o == va;
              a.forEach((u) => {
                u.queued || (!l && u.triggerName != i) || s.push(u);
              });
            }
          }
          return (
            (r || i) &&
              (s = s.filter(
                (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
              )),
            s
          );
        }
        _beforeAnimationBuild(e, t, r) {
          const o = t.element,
            s = t.isRemovalTransition ? void 0 : e,
            a = t.isRemovalTransition ? void 0 : t.triggerName;
          for (const l of t.timelines) {
            const u = l.element,
              c = u !== o,
              d = Ht(r, u, []);
            this._getPreviousPlayers(u, c, s, a, t.toState).forEach((g) => {
              const m = g.getRealPlayer();
              m.beforeDestroy && m.beforeDestroy(), g.destroy(), d.push(g);
            });
          }
          hi(o, t.fromStyles);
        }
        _buildAnimation(e, t, r, i, o, s) {
          const a = t.triggerName,
            l = t.element,
            u = [],
            c = new Set(),
            d = new Set(),
            p = t.timelines.map((m) => {
              const C = m.element;
              c.add(C);
              const E = C[ln];
              if (E && E.removedBeforeQueried)
                return new ga(m.duration, m.delay);
              const w = C !== l,
                R = (function yB(n) {
                  const e = [];
                  return z1(n, e), e;
                })((r.get(C) || cB).map((yt) => yt.getRealPlayer())).filter(
                  (yt) => !!yt.element && yt.element === C
                ),
                S = o.get(C),
                P = s.get(C),
                ce = _1(0, this._normalizer, 0, m.keyframes, S, P),
                pe = this._buildPlayer(m, ce, R);
              if ((m.subTimeline && i && d.add(C), w)) {
                const yt = new Mp(e, a, C);
                yt.setRealPlayer(pe), u.push(yt);
              }
              return pe;
            });
          u.forEach((m) => {
            Ht(this.playersByQueriedElement, m.element, []).push(m),
              m.onDone(() =>
                (function pB(n, e, t) {
                  let r = n.get(e);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(t);
                      r.splice(i, 1);
                    }
                    0 == r.length && n.delete(e);
                  }
                  return r;
                })(this.playersByQueriedElement, m.element, m)
              );
          }),
            c.forEach((m) => un(m, M1));
          const g = Lr(p);
          return (
            g.onDestroy(() => {
              c.forEach((m) => Eo(m, M1)), Wn(l, t.toStyles);
            }),
            d.forEach((m) => {
              Ht(i, m, []).push(g);
            }),
            g
          );
        }
        _buildPlayer(e, t, r) {
          return t.length > 0
            ? this.driver.animate(
                e.element,
                t,
                e.duration,
                e.delay,
                e.easing,
                r
              )
            : new ga(e.duration, e.delay);
        }
      }
      class Mp {
        constructor(e, t, r) {
          (this.namespaceId = e),
            (this.triggerName = t),
            (this.element = r),
            (this._player = new ga()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(e) {
          this._containsRealPlayer ||
            ((this._player = e),
            this._queuedCallbacks.forEach((t, r) => {
              t.forEach((i) => op(e, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(e.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(e) {
          this.totalTime = e;
        }
        syncPlayerEvents(e) {
          const t = this._player;
          t.triggerCallback && e.onStart(() => t.triggerCallback("start")),
            e.onDone(() => this.finish()),
            e.onDestroy(() => this.destroy());
        }
        _queueEvent(e, t) {
          Ht(this._queuedCallbacks, e, []).push(t);
        }
        onDone(e) {
          this.queued && this._queueEvent("done", e), this._player.onDone(e);
        }
        onStart(e) {
          this.queued && this._queueEvent("start", e), this._player.onStart(e);
        }
        onDestroy(e) {
          this.queued && this._queueEvent("destroy", e),
            this._player.onDestroy(e);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(e) {
          this.queued || this._player.setPosition(e);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(e) {
          const t = this._player;
          t.triggerCallback && t.triggerCallback(e);
        }
      }
      function qu(n) {
        return n && 1 === n.nodeType;
      }
      function j1(n, e) {
        const t = n.style.display;
        return (n.style.display = e ?? "none"), t;
      }
      function H1(n, e, t, r, i) {
        const o = [];
        t.forEach((l) => o.push(j1(l)));
        const s = [];
        r.forEach((l, u) => {
          const c = new Map();
          l.forEach((d) => {
            const p = e.computeStyle(u, d, i);
            c.set(d, p), (!p || 0 == p.length) && ((u[ln] = dB), s.push(u));
          }),
            n.set(u, c);
        });
        let a = 0;
        return t.forEach((l) => j1(l, o[a++])), s;
      }
      function G1(n, e) {
        const t = new Map();
        if ((n.forEach((a) => t.set(a, [])), 0 == e.length)) return t;
        const i = new Set(e),
          o = new Map();
        function s(a) {
          if (!a) return 1;
          let l = o.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = t.has(u) ? u : i.has(u) ? 1 : s(u)), o.set(a, l), l;
        }
        return (
          e.forEach((a) => {
            const l = s(a);
            1 !== l && t.get(l).push(a);
          }),
          t
        );
      }
      function un(n, e) {
        n.classList?.add(e);
      }
      function Eo(n, e) {
        n.classList?.remove(e);
      }
      function _B(n, e, t) {
        Lr(t).onDone(() => n.processLeaveNode(e));
      }
      function z1(n, e) {
        for (let t = 0; t < n.length; t++) {
          const r = n[t];
          r instanceof g1 ? z1(r.players, e) : e.push(r);
        }
      }
      function q1(n, e, t) {
        const r = t.get(n);
        if (!r) return !1;
        let i = e.get(n);
        return i ? r.forEach((o) => i.add(o)) : e.set(n, r), t.delete(n), !0;
      }
      class Wu {
        constructor(e, t, r) {
          (this.bodyNode = e),
            (this._driver = t),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, o) => {}),
            (this._transitionEngine = new hB(e, t, r)),
            (this._timelineEngine = new oB(e, t, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) =>
              this.onRemovalComplete(i, o));
        }
        registerTrigger(e, t, r, i, o) {
          const s = e + "-" + i;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              c = mp(this._driver, o, l, []);
            if (l.length)
              throw (function rU(n, e) {
                return new T(3404, !1);
              })();
            (a = (function tB(n, e, t) {
              return new nB(n, e, t);
            })(i, c, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(t, i, a);
        }
        register(e, t) {
          this._transitionEngine.register(e, t);
        }
        destroy(e, t) {
          this._transitionEngine.destroy(e, t);
        }
        onInsert(e, t, r, i) {
          this._transitionEngine.insertNode(e, t, r, i);
        }
        onRemove(e, t, r, i) {
          this._transitionEngine.removeNode(e, t, i || !1, r);
        }
        disableAnimations(e, t) {
          this._transitionEngine.markElementAsDisabled(e, t);
        }
        process(e, t, r, i) {
          if ("@" == r.charAt(0)) {
            const [o, s] = y1(r);
            this._timelineEngine.command(o, t, s, i);
          } else this._transitionEngine.trigger(e, t, r, i);
        }
        listen(e, t, r, i, o) {
          if ("@" == r.charAt(0)) {
            const [s, a] = y1(r);
            return this._timelineEngine.listen(s, t, a, o);
          }
          return this._transitionEngine.listen(e, t, r, i, o);
        }
        flush(e = -1) {
          this._transitionEngine.flush(e);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let DB = (() => {
        class n {
          constructor(t, r, i) {
            (this._element = t),
              (this._startStyles = r),
              (this._endStyles = i),
              (this._state = 0);
            let o = n.initialStylesByElement.get(t);
            o || n.initialStylesByElement.set(t, (o = new Map())),
              (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                Wn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (Wn(this._element, this._initialStyles),
                this._endStyles &&
                  (Wn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (n.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (hi(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (hi(this._element, this._endStyles),
                  (this._endStyles = null)),
                Wn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (n.initialStylesByElement = new WeakMap()), n;
      })();
      function Tp(n) {
        let e = null;
        return (
          n.forEach((t, r) => {
            (function bB(n) {
              return "display" === n || "position" === n;
            })(r) && ((e = e || new Map()), e.set(r, t));
          }),
          e
        );
      }
      class W1 {
        constructor(e, t, r, i) {
          (this.element = e),
            (this.keyframes = t),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const e = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            e,
            this.options
          )),
            (this._finalKeyframe = e.length ? e[e.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(e) {
          const t = [];
          return (
            e.forEach((r) => {
              t.push(Object.fromEntries(r));
            }),
            t
          );
        }
        _triggerWebAnimation(e, t, r) {
          return e.animate(this._convertKeyframesToObject(t), r);
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((e) => e()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        setPosition(e) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = e * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const e = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i &&
                e.set(i, this._finished ? r : N1(this.element, i));
            }),
            (this.currentSnapshot = e);
        }
        triggerCallback(e) {
          const t = "start" === e ? this._onStartFns : this._onDoneFns;
          t.forEach((r) => r()), (t.length = 0);
        }
      }
      class EB {
        validateStyleProperty(e) {
          return !0;
        }
        validateAnimatableStyleProperty(e) {
          return !0;
        }
        matchesElement(e, t) {
          return !1;
        }
        containsElement(e, t) {
          return b1(e, t);
        }
        getParentElement(e) {
          return up(e);
        }
        query(e, t, r) {
          return E1(e, t, r);
        }
        computeStyle(e, t, r) {
          return window.getComputedStyle(e)[t];
        }
        animate(e, t, r, i, o, s = []) {
          const l = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          o && (l.easing = o);
          const u = new Map(),
            c = s.filter((g) => g instanceof W1);
          (function TU(n, e) {
            return 0 === n || 0 === e;
          })(r, i) &&
            c.forEach((g) => {
              g.currentSnapshot.forEach((m, C) => u.set(C, m));
            });
          let d = (function EU(n) {
            return n.length
              ? n[0] instanceof Map
                ? n
                : n.map((e) => T1(e))
              : [];
          })(t).map((g) => Vr(g));
          d = (function IU(n, e, t) {
            if (t.size && e.length) {
              let r = e[0],
                i = [];
              if (
                (t.forEach((o, s) => {
                  r.has(s) || i.push(s), r.set(s, o);
                }),
                i.length)
              )
                for (let o = 1; o < e.length; o++) {
                  let s = e[o];
                  i.forEach((a) => s.set(a, N1(n, a)));
                }
            }
            return e;
          })(e, d, u);
          const p = (function CB(n, e) {
            let t = null,
              r = null;
            return (
              Array.isArray(e) && e.length
                ? ((t = Tp(e[0])), e.length > 1 && (r = Tp(e[e.length - 1])))
                : e instanceof Map && (t = Tp(e)),
              t || r ? new DB(n, t, r) : null
            );
          })(e, d);
          return new W1(e, d, l, p);
        }
      }
      let wB = (() => {
        class n extends d1 {
          constructor(t, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = t.createRenderer(r.body, {
                id: "0",
                encapsulation: hn.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(t) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(t) ? f1(t) : t;
            return (
              K1(this._renderer, null, r, "register", [i]),
              new SB(r, this._renderer)
            );
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(es), N(at));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class SB extends k$ {
        constructor(e, t) {
          super(), (this._id = e), (this._renderer = t);
        }
        create(e, t) {
          return new MB(this._id, e, t || {}, this._renderer);
        }
      }
      class MB {
        constructor(e, t, r, i) {
          (this.id = e),
            (this.element = t),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(e, t) {
          return this._renderer.listen(this.element, `@@${this.id}:${e}`, t);
        }
        _command(e, ...t) {
          return K1(this._renderer, this.element, this.id, e, t);
        }
        onDone(e) {
          this._listen("done", e);
        }
        onStart(e) {
          this._listen("start", e);
        }
        onDestroy(e) {
          this._listen("destroy", e);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(e) {
          this._command("setPosition", e);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function K1(n, e, t, r, i) {
        return n.setProperty(e, `@@${t}:${r}`, i);
      }
      const Q1 = "@.disabled";
      let TB = (() => {
        class n {
          constructor(t, r, i) {
            (this.delegate = t),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (o, s) => {
                const a = s?.parentNode(o);
                a && s.removeChild(a, o);
              });
          }
          createRenderer(t, r) {
            const o = this.delegate.createRenderer(t, r);
            if (!(t && r && r.data && r.data.animation)) {
              let c = this._rendererCache.get(o);
              return (
                c ||
                  ((c = new Y1("", o, this.engine, () =>
                    this._rendererCache.delete(o)
                  )),
                  this._rendererCache.set(o, c)),
                c
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, t);
            const l = (c) => {
              Array.isArray(c)
                ? c.forEach(l)
                : this.engine.registerTrigger(s, a, t, c.name, c);
            };
            return r.data.animation.forEach(l), new IB(this, a, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(t, r, i) {
            t >= 0 && t < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((o) => {
                        const [s, a] = o;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)(N(es), N(Wu), N(Ve));
          }),
          (n.ɵprov = O({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class Y1 {
        constructor(e, t, r, i) {
          (this.namespaceId = e),
            (this.delegate = t),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode
              ? (o) => t.destroyNode(o)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(e, t) {
          return this.delegate.createElement(e, t);
        }
        createComment(e) {
          return this.delegate.createComment(e);
        }
        createText(e) {
          return this.delegate.createText(e);
        }
        appendChild(e, t) {
          this.delegate.appendChild(e, t),
            this.engine.onInsert(this.namespaceId, t, e, !1);
        }
        insertBefore(e, t, r, i = !0) {
          this.delegate.insertBefore(e, t, r),
            this.engine.onInsert(this.namespaceId, t, e, i);
        }
        removeChild(e, t, r) {
          this.engine.onRemove(this.namespaceId, t, this.delegate, r);
        }
        selectRootElement(e, t) {
          return this.delegate.selectRootElement(e, t);
        }
        parentNode(e) {
          return this.delegate.parentNode(e);
        }
        nextSibling(e) {
          return this.delegate.nextSibling(e);
        }
        setAttribute(e, t, r, i) {
          this.delegate.setAttribute(e, t, r, i);
        }
        removeAttribute(e, t, r) {
          this.delegate.removeAttribute(e, t, r);
        }
        addClass(e, t) {
          this.delegate.addClass(e, t);
        }
        removeClass(e, t) {
          this.delegate.removeClass(e, t);
        }
        setStyle(e, t, r, i) {
          this.delegate.setStyle(e, t, r, i);
        }
        removeStyle(e, t, r) {
          this.delegate.removeStyle(e, t, r);
        }
        setProperty(e, t, r) {
          "@" == t.charAt(0) && t == Q1
            ? this.disableAnimations(e, !!r)
            : this.delegate.setProperty(e, t, r);
        }
        setValue(e, t) {
          this.delegate.setValue(e, t);
        }
        listen(e, t, r) {
          return this.delegate.listen(e, t, r);
        }
        disableAnimations(e, t) {
          this.engine.disableAnimations(e, t);
        }
      }
      class IB extends Y1 {
        constructor(e, t, r, i, o) {
          super(t, r, i, o), (this.factory = e), (this.namespaceId = t);
        }
        setProperty(e, t, r) {
          "@" == t.charAt(0)
            ? "." == t.charAt(1) && t == Q1
              ? this.disableAnimations(e, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, e, t.slice(1), r)
            : this.delegate.setProperty(e, t, r);
        }
        listen(e, t, r) {
          if ("@" == t.charAt(0)) {
            const i = (function AB(n) {
              switch (n) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return n;
              }
            })(e);
            let o = t.slice(1),
              s = "";
            return (
              "@" != o.charAt(0) &&
                ([o, s] = (function xB(n) {
                  const e = n.indexOf(".");
                  return [n.substring(0, e), n.slice(e + 1)];
                })(o)),
              this.engine.listen(this.namespaceId, i, o, s, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(e, t, r);
        }
      }
      const X1 = [
          { provide: d1, useClass: wB },
          {
            provide: Dp,
            useFactory: function NB() {
              return new XU();
            },
          },
          {
            provide: Wu,
            useClass: (() => {
              class n extends Wu {
                constructor(t, r, i, o) {
                  super(t.body, r, i);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                (n.ɵfac = function (t) {
                  return new (t || n)(N(at), N(cp), N(Dp), N(_s));
                }),
                (n.ɵprov = O({ token: n, factory: n.ɵfac })),
                n
              );
            })(),
          },
          {
            provide: es,
            useFactory: function FB(n, e, t) {
              return new TB(n, e, t);
            },
            deps: [Kl, Wu, Ve],
          },
        ],
        Ip = [
          { provide: cp, useFactory: () => new EB() },
          { provide: pC, useValue: "BrowserAnimations" },
          ...X1,
        ],
        Z1 = [
          { provide: cp, useClass: w1 },
          { provide: pC, useValue: "NoopAnimations" },
          ...X1,
        ];
      let PB = (() => {
        class n {
          static withConfig(t) {
            return { ngModule: n, providers: t.disableAnimations ? Z1 : Ip };
          }
        }
        return (
          (n.ɵfac = function (t) {
            return new (t || n)();
          }),
          (n.ɵmod = Qt({ type: n })),
          (n.ɵinj = Pt({ providers: Ip, imports: [ND] })),
          n
        );
      })();
      class wo {}
      (wo.ɵfac = function (e) {
        return new (e || wo)();
      }),
        (wo.ɵmod = Qt({ type: wo, bootstrap: [pa] })),
        (wo.ɵinj = Pt({
          providers: [{ provide: iE, useClass: bo, multi: !0 }],
          imports: [ND, Do, $L, R2, PB],
        })),
        bP()
          .bootstrapModule(wo)
          .catch((n) => console.error(n));
    },
  },
  (Ee) => {
    Ee((Ee.s = 311));
  },
]);
