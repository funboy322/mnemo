"use client";
import * as React from "react";
import { dicts, type Locale, type Dict, DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
};

const LocaleCtx = React.createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  t: dicts[DEFAULT_LOCALE],
  setLocale: () => {},
});

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    // Persist via cookie (so server reads same value next request)
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Also mirror to <html lang>
    document.documentElement.lang = l;
    // Force route to re-fetch server components with new locale
    // (cookie already updated, just reload current route)
    if (typeof window !== "undefined") window.location.reload();
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({ locale, t: dicts[locale] ?? dicts[DEFAULT_LOCALE], setLocale }),
    [locale, setLocale],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  return React.useContext(LocaleCtx).locale;
}

export function useT(): Dict {
  return React.useContext(LocaleCtx).t;
}

export function useSetLocale() {
  return React.useContext(LocaleCtx).setLocale;
}
