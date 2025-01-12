# NextStop WEA

## Architektur

Das Projekt baut sich sehr einfach auf:

- ``common``: beinhaltet Seiten übergreifende Componenten
- ``guards``: Alle guards des Projekts
- ``models``: Alle Modelle des Projekts
- ``pages``: Alle Pages, per Page ein ordner mit der Haupt-Componente und ein Components ordner für Scoped-Subkomponenten
- ``pipes``: Alles Pipes des Projekts
- ``services``: Alles Services des Projekts
- ``gravatar.directrive``: Eine Direktive zum Einbinden eines Benutzerbildes über Gravatar.

### Main page

![main page](./docs/architektur-1.drawio.png)

#### Services:

- ``authenticationService``

#### Components:

- ``router-outlet``: Leitet zu den Pages weiter

### Not Found (Error 404) page

![not found page](./docs/architektur-2.drawio.png)

### Stops page

![stop page](./docs/architektur-3.drawio.png)

#### Services:

- ``stopsService``

#### Components:

- ``AppHeader``: Rein Dekorativ
- ``CreateStationDialog``
- ``UpdateStationDialog``

### Routes page

![routes page](./docs/architektur-4.drawio.png)

#### Services:

- ``routesService``
- ``routeStopsService``
- ``stopsService``
- ``holidayService``

#### Components:

- ``AppHeader``: Rein Dekorativ
- ``CreateRouteDialog``
- ``RouteStopPointComponent``: Logik zur erstellung eines RouteStopPoints
- ``Stops``: Logik zur erstellung einer abfolge von RouteStopPoints aka Route

### Holidays page

![holidays page](./docs/architektur-5.drawio.png)

#### Services:

- ``holidayService``

#### Components:

- ``AppHeader``: Rein Dekorativ
- ``CreateHolidayDialog``
- ``UpdateHolidayDialog``

### Stats page

![stats page](./docs/architektur-6.drawio.png)

### Find route (navigation) page

![find route page](./docs/architektur-7.drawio.png)

#### Services:

- ``stopsService``

#### Components:

- ``AppHeader``: Rein Dekorativ
- ``TimeSelector``: Logik zur Uhrzeit und Datum's eingabe, inklusive toggl für Abfahrts oder ankunftszeit
- ``RouteQueryForm``: Formular zur eingabe von Routen

### Station page

![station page](./docs/architektur-8.drawio.png)

## Navigation

![main page](./docs/architektur-9.drawio.png)

Die App Navigation baut sich sehr simpel und Linear auf, Rechts befindet sich das Hauptmenü mit den wichtigsten Punkten, die Punkte werden je nach authentifizierungs Zustand angezeigt.
Dabeir wird bei einer invaliden Route immer auf die ``NotFound`` component verwiesen, mittels catch-all route.
Dem Benutzer steht es frei sich an oder abzmelden, da auch nach einer Anmmeldung noch alle funktionen zur verfügung stehen.

## Testläufe

Eingeklapptes Menü, kein Login
![#1](./docs/test-1.png)

Ausgeklapptes Menü, kein Login
![#2](./docs/test-2.png)

Ausgeklapptes Menü, NotFound Seite für nicht implementierte Componente
![#3](./docs/test-3.png)

Ausgeklapptes Menü, NotFound Seite für nicht implementierte Componente
![#4](./docs/test-4.png)

Login (KeyCloak)
![#5](./docs/test-5.png)
![#6](./docs/test-6.png)

Authentifiziert, ``Find Route`` Seite`, nicht implementierte, jedoch angelegt
![#7](./docs/test-7.png)

Authentifiziert, ``Stops`` Seite
![#8](./docs/test-8.png)

Authentifiziert, ``Stops`` Seite, anlegen eines Stops
![#9](./docs/test-9.png)

Authentifiziert, ``Stops`` Seite, updaten eines Stops
![#10](./docs/test-10.png)

Authentifiziert, ``Stops`` Seite, fehler beim löschen einen Stops (CORS)
![#11](./docs/test-11.png)

Authentifiziert, ``Routen`` Seite, nicht implementierte, jedoch angelegt
![#12](./docs/test-12.png)

Authentifiziert, ``Holiday`` Seite
![#13](./docs/test-13.png)

Authentifiziert, ``Stops`` Seite, anlegen eines Holiday
![#14](./docs/test-14.png)

Authentifiziert, Verspätungsstatistik, Seite Angelegt, keine Implementierung
![#15](./docs/test-15.png)

Logout (KeyCloak)
![#16](./docs/test-16.png)

## Fragen

### Was ist zu tun, wenn sich URLs ändern? Wie invasiv ist der Eingriff in Ihre Anwendung um diese zu ändern?

Alle URL's liegen in der ``config.ts`` und werden von dort Zentral über die Anwendung verteilt, genauso wie die KeyCload/OIDC Konfiguration.
Damit sind diese nur in der ``config.ts`` zu ändern und es benötigt einen Recompile.

### Wie stellen Sie sicher, dass bestimmte Seiten nur nach einem Login zugreiϐbar sind?

Es gibt 2 maßnahmen:

- Routen Werden überhaupt nur bei erfolgter Anmeldung im ``app.component.{ts,html}`` angezeigt. (obfuscation)
- Eine Guard leitet User welche Routen manuell oder über externe Links annavigieren an die ``/not-found`` Route weiter, hier wäre ein redirect an den Login eleganter gewesen.

### Wie stellen Sie eine korrekte Dateneingabe sicher?

Formulare werden clientseitig nur minimal validiert, es wird sichergestellt, dass zumindest der Korrekte Datentyp eingegeben wird und bei Coordinaten ob sie in der Korrekten Range sind.

### Was passiert, wenn Aufrufe an das Backend Fehler produzieren?

Es wird hier, sofern relevant für den User eine Angular Material ``SnackBar`` auf dem bildschirm mit einem groben Fehler angzeigt.
Der Technische Fehler wird mittels ``console.error()`` geloggt.

## Setup

## Externe Komponenten

- Angular Material: Komponenten Bobliothek
- TailwindCSS: Utility CSS Klassen

## Nicht Implementierte Features

- Feiertage können bearbeitet werden
- Routen können inkl. Abfahrtszeiten erstellt werden.
- Haltestellen können gesucht werden, z. B. nach dem Namen oder anhand des aktuellen Standorts.
- Fahrplanabfragen können gemacht werden.
- Anzeigetafeln zeigen die nächsten Abfahrten für die aktuelle Haltestelle.
- Verspätungen werden in der Suche und auf der Anzeigetafel berücksichtigt.
- Eine Verspätungsstatistik gibt Auskunft über die Pünktlichkeit aller Verkehrsmittel.
- Darstellung der Verspätungsstatistik in Diagrammen.
