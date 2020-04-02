# **Save the cyclists!**

- Check out the web-map [**here**](https://oloocki.github.io/)!
- or XYZ Studio Draft version [**here**](https://xyz.here.com/viewer/?project_id=2bda1f87-2b85-4513-8499-f8847325e8f8)!

## **Tutorial**

Do you wanna recreate the solution? Would you like to inherit new ideas? 

- Check out the "Hands on" blog post at HERE Developer page [**Helping Cyclists Stay Safe Using HERE Studio**](https://developer.here.com/blog/helping-cyclists-stay-safe-here-studio?_lrsc=13d8722c-a051-46a5-ba3f-cc20e5148d03&cid=other-Elevate-FD-0-HERE-&utm_source=Elevate&utm_medium=social&utm_campaign=Online_CommsShare_2020) written by me (@OloOcki)

## **Data used to save cyclists**
### **Datasets from [Geoportal Berlin](https://fbinter.stadt-berlin.de/fb/index.jsp):**

- [**Lichtsignalanlagen**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Traffic lights*)

  - Dataset containing position of each traffic light in Berlin, also address information available

- [**Verkehrszellen/Teilverkehrszellen in Berlin**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Traffic cells / partial traffic cells in Berlin*)

  - Dataset containing polygons describing traffic cells for mobility planning for city authorithies

- [**Radverkehrsanlage**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Cycling facilities*)

  - Dataset containing types of cycleways (cycle track, cycle lane), type of share (shared with pedestrians or only for cycling), 
types of lines (solid line, dashed line), obligation to use (yes, no), also address information available 

  - Dataset containing position of traffic signs for cyclists, with a type of sign and address information 

- [**Straßenbeleuchtung-Berlin**](https://opendata-esri-de.opendata.arcgis.com/datasets/esri-de-content::stra%C3%9Fenbeleuchtung-berlin) (*Public street lighting*)

  - Dataset with the street lighting with the respective location, a symbol indicating the type of street light and source of power

- [**Tempolimits**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Speed limits*)

  - Dataset containing road network with speed limits for each segment, at certain time of specific days 

- [**Detailnetz Verbindungspunkte**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Detail network junction points*)

  - Dataset contains crossroads and other junctions of different types of roads

- [**Winterdienstmaßnahmen auf Gehwegen**](https://fbinter.stadt-berlin.de/fb/index.jsp) (*Winter maintenance on sidewalks*)

  - Dataset containing information what part of sidewalks (including cycleways) are cleaned by city maintanance during winter

### **Dataset from [Statistisches Bundesamt (Destatis):](https://www.destatis.de/EN/About-Us/_node.html)** (*The Federal Statistical Office*):

- [**Verkehrsunfälle 2018**](https://unfallatlas.statistikportal.de/) (*Traffic accidents 2018*), [**Metadata**](https://unfallatlas.statistikportal.de/app/UnfalldatenDownload/DSB_Unfallatlas.pdf)

  - Dataset contains road accidents with personal injury on national level. It has position, type of accident (i.e. Turning accident, Turning
over / crossing accident) type of collission (i. e. collision with laterally moving vehicle), accident category (i.e. accident with
fatalities, accident with severely injured), Light conditions (i.e. daylight, night), road conditions (i.e. wet, dry, snow), number of
participating drivers and type of vehicle (i.e. bicycle, car) or pedestrians

