import type { NextFunction, Request, Response } from "express";
import { en } from "./en";
import { is, type Dictionary } from "./is";

export const LOCALES = ["is", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "is";

export const LOCALE_INFO: Record<Locale, { name: string; flag: string }> = {
    is: { name: "Íslenska", flag: "🇮🇸" },
    en: { name: "English", flag: "🇬🇧" },
};

const DICTIONARIES: Record<Locale, Dictionary> = { is, en };

/** Prefix a site-relative path with the locale segment, e.g. ("/thjonusta", "en") -> "/en/thjonusta". */
export const localize_path = (path: string, locale: Locale): string => {
    if (locale === DEFAULT_LOCALE) {
        return path;
    }

    return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

/**
 * Exposes to views:
 *   lang         – current locale code
 *   t            – the dictionary for the current locale
 *   url(path)    – locale-aware link builder
 *   page_path    – the current path without the locale prefix
 *   alternates   – [{ locale, name, flag, href, current }] for the language switcher / hreflang
 */
export const with_locale = (locale: Locale) => (req: Request, res: Response, next: NextFunction) => {
    // Mounted at "/en" (or "/"), so req.path here is already stripped of the locale prefix.
    const page_path = req.path;

    res.locals.lang = locale;
    res.locals.t = DICTIONARIES[locale];
    res.locals.url = (path: string) => localize_path(path, locale);
    res.locals.page_path = page_path;
    res.locals.alternates = LOCALES.map((l) => ({
        locale: l,
        ...LOCALE_INFO[l],
        href: localize_path(page_path, l),
        current: l === locale,
    }));

    next();
};
