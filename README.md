## Набор скриптов для работы с PDF-документом в программе Adobe Acrobat PRO
***
#измерить #определить #формат #размер #страниц #PDF #нестандартная #нумерация

### Описание
***
Набор сценариев на языке Java Script для Adobe Actobat PRO на основе Acrobat JavaScript API.
> 
> * **не работает в Adobe Acrobat Reader**  
> * **не гарантируется (не проверялась) работа в Adobe Acrobat Standart**  
> * **не тестировалось в Mac OS**  
>
> 
 ### Требования
 ***
> * OS Windows 7-11;  
> * Adobe Acrobat Professional, подробнее о совместимости можно посмотреть в [Acrobat JavaScript API](https://opensource.adobe.com/dc-acrobat-sdk-docs/library/jsapiref/index.htmlc "This document is a complete reference to the Acrobat extensions to JavaScript, its objects, methods, and properties")


### Установка
***
Загруженный файл должен быть помещён/скопирован в папку со скриптами в директорию установленной программы Adobe Acrobat PRO (***возможный путь: C:/Program Files/Adobe/Acrobat DC/Acrobat/Javascripts***), после этого нужно перезапустить программу Acrobat, если она была запущена. В меню "Редактирование" ("Edit"), появится новый пункт "Дополнительно" ("Additional").

![pic](https://github.com/monksbarn/js-script-pack-acrobat/blob/main/src/screenshot.png)

### Возможности

- [x] **Определение форматов (***formatDetection***) - посчитать форматы и диапазоны их распределения на основе фактического размера страниц PDF-документа (***ISO 216:1975 для серии "А"***):**
    
  > * возможность подсчёта отдельно альбомных и портретных страниц;
  > * вывод размеров страниц для пропорций 1:1 и размеров, превышающих максимально допустимый по ISO;
  > * вывод детального отчета о размере каждой страницы;
  > * подсчет страниц в формате А3 как А4, страниц А3 и А2 как А4;
  > * если формат не удалось распознать, включить его в диапазон наиболее подходящих по размеру ISO-форматов.


- [x] **Создать новый документ (***newDocument***) - создать новый документ PDF формата А4;**

- [x] **Закрыть все вкладки (***closeTabs***) - закрыть все открытые вкладки без сохранения;**

- [x] **Инвертироать диапазон (***invertRange***) - инвертировать заданный набор интервалов (***например, если на вход будет подан интервал [ 1 - 5, 19, 23 ], при этом файл будет содержать 50 страниц, то на выходе получится интервал [ 6 - 18, 20 - 22, 24 -50 ]*** );**

- [x] **Повернуть страницы (***ratatePage***) - повернуть страницы заданной ориентации (либо только альбомные, либо только портретные);**

- [x] **Извлечь страницы (***extractPages***) - извлечь заданный диапазон страниц (***например, если на вход будет подан интервал [ 1 - 5, 19, 23 ], то будет создан новый документ, содержащий страницы этого интерала***);**

- [x] **Нумерация страниц (***numberingPages***) - нумерация страниц с дополнтельными возможностями:**
   > 
   > * начинать нумерацию заново после того, как нумерация достигла указанного номера;  
   > * возможность задать разный инкремент (приращение, шаг изменения) для номера и для страницы;  
   > * возможность добавить к нумерации текст или создать кололнтитул;
   > * возможность декорировать нумерацию.  
   >  
- [x] **Сортировка страниц (***sortingPages***) - сортировка страниц на основе их размера (по убыванию или возрастанию);**

- [x] **Обратить порядок страниц (***reversePagesOrder***) - меняет порядок страниц на обратный.**
