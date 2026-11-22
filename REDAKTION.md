# Redaktionella instruktioner – Health Science Explained

Det här dokumentet styr hur nya artiklar skrivs, både av människor och av den veckovisa automatiska rutinen.

## Sajten
- Namn: **Health Science Explained**, https://healthscienceexplained.com
- Svenska, populärvetenskaplig hälsoinformation: kroppen, läkemedel, kosttillskott, sömn, träning, nutrition och peptider.
- Repo: `Dallashqergash/peptides-site` (branch `main`). Varje push till `main` publiceras automatiskt via GitHub Actions på ca 1 minut.

## Ämnesval (sökordsdrivet)
1. Utgå från vad svenskar faktiskt söker efter. Metod:
   - Google autocomplete på svenska: `https://suggestqueries.google.com/complete/search?client=firefox&hl=sv&gl=se&q=<sökord>`
     Testa breda startord (t.ex. "magnesium", "kreatin", "sömn", "vad händer i kroppen när", "är det farligt att", "symtom", "brist") och se vilka följdfrågor som dyker upp.
   - Säsong: välj ämnen som passar årstiden (vinter: D-vitamin, förkylning, sömn/mörker; vår: allergi, träningsstart; sommar: sol, värme, vätska; höst: rutiner, infektioner).
   - Om Search Console-data finns: prioritera sökfrågor där sajten redan syns men har låg klickfrekvens.
2. Välj ett ämne som **inte redan finns** på sajten (kolla `src/blogg/` och `AMNESPLAN.md`).
3. Formulera rubriken kring sökfrågan (t.ex. "Magnesium och sömn: vilken form är bäst – och fungerar det?").
4. Uppdatera `AMNESPLAN.md`: flytta ämnet till "Publicerat" med datum och filnamn.

## Innehållskrav
- 900–1 500 ord, sakligt, lättläst, svensk ton. Struktur: ingress, H2-avsnitt, gärna en tabell och en citatruta (`>`), "Sammanfattning" i punktform och "## Källor" sist.
- **Fakta ska bygga på verifierade källor.** Prioritera svenska myndigheter (Livsmedelsverket, 1177, Läkemedelsverket, Folkhälsomyndigheten, SBU), FASS/EMA och vetenskapliga studier.
  - Kontrollera varje studie mot PubMed (E-utilities: `esearch.fcgi` + `esummary.fcgi`) och länka till `https://pubmed.ncbi.nlm.nih.gov/<PMID>/`.
  - Kontrollera att varje extern länk svarar (HTTP 200). Hittar du inte en källa – skriv inte påståendet.
  - Siffror (doser, gränsvärden, procent) ska komma direkt från källan.
- Beskriv evidensnivån ärligt: skilj på djurstudier, observationsstudier och randomiserade studier.
- Interna länkar: länka till 1–3 relevanta befintliga artiklar på sajten.
- Författare: "Redaktionen" (standard). Hitta aldrig på experter, granskare, titlar eller citat.

## Förbjudet
- **Inga länkar till butiker, säljare eller affiliate-länkar** – i synnerhet inte till sajter som säljer peptider, "research chemicals", receptbelagda läkemedel eller oregistrerade substanser (t.ex. peptideslux.com).
- Inga doseringsråd för receptbelagda eller ej godkända läkemedel/substanser. Hänvisa till läkare.
- Inga påståenden om att något botar, förebygger eller behandlar sjukdom utan stöd i randomiserade studier.
- Ingen produktreklam eller "bästa köp"-listor.

## Bild
- Skapa omslag med `verktyg/omslag.ps1` (1600x900 jpg i `src/bilder/artiklar/<slug>.jpg`):
  `powershell -ExecutionPolicy Bypass -File verktyg\omslag.ps1 -Slug <slug> -Etikett "<Kategori>" -Rubrik "<Rubrik>" -Tema <sol|molekyl|puls|sömn>`
- Kontrollera bilden visuellt innan publicering.

## Front matter (mall)
```yaml
---
title: "Rubrik"
description: "Ingress, 1–2 meningar (max ca 160 tecken visas i Google)."
date: ÅÅÅÅ-MM-DD
kategori: Grunderna | GLP-1 och ämnesomsättning | Kosttillskott | Forskning och säkerhet | Historia | Sömn och återhämtning | Träning | Kropp och hälsa
bild: /bilder/artiklar/<slug>.jpg
bildtext: "Beskrivning av bilden"
bildkalla: "Illustration: Health Science Explained."
---
```
Ny kategori? Lägg även till den i `src/admin/config.yml` (kategori-listan).

## Publicering
1. `npx @11ty/eleventy` – bygget ska gå utan fel.
2. Commit med meddelande `Ny artikel: <rubrik>` och push till `main`.
3. Vänta på GitHub Actions-körningen (`gh run watch`) och kontrollera att `https://healthscienceexplained.com/blogg/<slug>/` svarar 200.
