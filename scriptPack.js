/* 
Набор скриптов для работы с PDF-документом:
    1) formatDetection - посчитать форматы и дапазоны их распределения на основе фактического размера страниц PDF-документа (ISO 216:1975 для серии "А");
    
    //возможность подсчета отдельно альбомных и портретных страниц
    //вывод размеров страниц для пропорций 1:1
    //вывод детального отчета о размере каждой страницы
    //подсчет страниц в формате А3 как А4, страниц А3 и А2 как А4
    //если соотношение сторон близко к 1:1, включить такие страницы в диапазон наиболее подходящих по размеру ISO-форматов

    2) newDocument - создать новый файл формата А4;
    3) closeTabs - закрыть все вкладки;
    4) invertRange - инвертировать заданный интервал (если на вход будет подан интервал [ 1 - 5, 19, 23 ], при этом файл будет содержать 50 страниц, то на выходе получится интервал [ 6 - 18, 20 - 22, 24 -50 ]);
    5) ratatePage - повернуть страницы заданной ориентации;
    6) extractPages - извлечь заданный диапазон страниц;
    7) numberingPages - нумерация страниц с дополнтельными возможностями;
    8) sortingPages - сортировка страниц на основе их размера (по убыванию или возрастанию);
    9) reversePagesOrder - обратить порядок страниц.
    
© qeuty@ya.ru
Самара, 2022 год от Рождества Христова
*/

//РУСИФИКАТОРО НОН ЭЛЕГАНТО

//GLOBAL VARIABLES (ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ)

global.gLang = global.gLang ? global.gLang : (app.language == "RUS" || app.language == "ENG") ? app.language : "ENG";
global.setPersistent('gLang', true);

//абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ
// 34А) Code: Р_left = 1056, ђ_right = 1106
// 35Б) Code: Р_left = 1056, ‘_right = 8216
// 36В) Code: Р_left = 1056, ’_right = 8217
// 37Г) Code: Р_left = 1056, “_right = 8220
// 38Д) Code: Р_left = 1056, ”_right = 8221
// 39Е) Code: Р_left = 1056, •_right = 8226
// 40Ё) Code: Р_left = 1056, Ѓ_right = 1027
// 41Ж) Code: Р_left = 1056, –_right = 8211
// 42З) Code: Р_left = 1056, —_right = 8212
// 43И) Code: Р_left = 1056, _right = 152
// 44Й) Code: Р_left = 1056, ™_right = 8482
// 45К) Code: Р_left = 1056, љ_right = 1113
// 46Л) Code: Р_left = 1056, ›_right = 8250
// 47М) Code: Р_left = 1056, њ_right = 1114
// 48Н) Code: Р_left = 1056, ќ_right = 1116
// 49О) Code: Р_left = 1056, ћ_right = 1115
// 50П) Code: Р_left = 1056, џ_right = 1119
// 51Р) Code: Р_left = 1056, _right = 160
// 52С) Code: Р_left = 1056, Ў_right = 1038
// 53Т) Code: Р_left = 1056, ў_right = 1118
// 54У) Code: Р_left = 1056, Ј_right = 1032
// 55Ф) Code: Р_left = 1056, ¤_right = 164
// 56Х) Code: Р_left = 1056, Ґ_right = 1168
// 57Ц) Code: Р_left = 1056, ¦_right = 166
// 58Ч) Code: Р_left = 1056, §_right = 167
// 59Ш) Code: Р_left = 1056, Ё_right = 1025
// 60Щ) Code: Р_left = 1056, ©_right = 169
// 61Ъ) Code: Р_left = 1056, Є_right = 1028
// 62Ы) Code: Р_left = 1056, «_right = 171
// 63Ь) Code: Р_left = 1056, ¬_right = 172
// 64Э) Code: Р_left = 1056, ­_right = 173
// 65Ю) Code: Р_left = 1056, ®_right = 174
// 66Я) Code: Р_left = 1056, Ї_right = 1031

var decode = app.trustedFunction(function (text) {
    app.beginPriv();
    var res = "";
    console.println("\n");
    for (var i = 0; i < text.length; i += 2) {
        var l = text.charCodeAt(i);
        var r = text.charCodeAt(i + 1);
        if (l == 1056) {
            switch (r) {
                case 176: res += "\u0430"; break;
                case 177: res += "\u0431"; break;
                case 1030: res += "\u0432"; break;
                case 1110: res += "\u0433"; break;
                case 1169: res += "\u0434"; break;
                case 181: res += "\u0435"; break;
                case 182: res += "\u0436"; break;
                case 183: res += "\u0437"; break;
                case 1105: res += "\u0438"; break;
                case 8470: res += "\u0439"; break;
                case 1108: res += "\u043a"; break;
                case 187: res += "\u043b"; break;
                case 1112: res += "\u043c"; break;
                case 1029: res += "\u043d"; break;
                case 1109: res += "\u043e"; break;
                case 1111: res += "\u043f"; break;

                //заглавные 
                case 1106: res += "\u0410"; break; //А
                case 8216: res += "\u0411"; break; //Б
                case 8217: res += "\u0412"; break; //В
                case 8220: res += "\u0413"; break; //Г
                case 8221: res += "\u0414"; break; //Д
                case 8226: res += "\u0415"; break; //Е
                case 1027: res += "\u0401"; break; //Ё
                case 8211: res += "\u0416"; break; //Ж
                case 8212: res += "\u0417"; break; //З
                case 152: res += "\u0418"; break; //И
                case 8482: res += "\u0419"; break; //Й
                case 1113: res += "\u041a"; break; //К
                case 8250: res += "\u041b"; break; //Л
                case 1114: res += "\u041c"; break; //М
                case 1116: res += "\u041d"; break; //Н
                case 1115: res += "\u041e"; break; //О
                case 1119: res += "\u041f"; break; //П
                case 160: res += "\u0420"; break; //Р
                case 1038: res += "\u0421"; break; //С
                case 1118: res += "\u0422"; break; //Т
                case 1032: res += "\u0423"; break; //У
                case 164: res += "\u0424"; break; //Ф
                case 1186: res += "\u0425"; break; //Х
                case 166: res += "\u0426"; break; //Ц
                case 167: res += "\u0427"; break; //Ч
                case 1025: res += "\u0428"; break; //Ш
                case 169: res += "\u0429"; break; //Щ
                case 1028: res += "\u042a"; break; //Ъ
                case 171: res += "\u042b"; break; //Ы
                case 172: res += "\u042c"; break; //Ь
                case 173: res += "\u042d"; break; //Э
                case 174: res += "\u042e"; break; //Ю
                case 1031: res += "\u042f"; break; //Я
            }
        } else if (l == 1057) {
            switch (r) {
                case 8216: res += "\u0451"; break;
                case 1026: res += "\u0440"; break;
                case 1027: res += "\u0441"; break;
                case 8218: res += "\u0442"; break;
                case 1107: res += "\u0443"; break;
                case 8222: res += "\u0444"; break;
                case 8230: res += "\u0445"; break;
                case 8224: res += "\u0446"; break;
                case 8225: res += "\u0447"; break;
                case 8364: res += "\u0448"; break;
                case 8240: res += "\u0449"; break;
                case 1033: res += "\u044a"; break;
                case 8249: res += "\u044b"; break;
                case 1034: res += "\u044c"; break;
                case 1036: res += "\u044d"; break;
                case 1035: res += "\u044e"; break;
                case 1039: res += "\u044f"; break;
            }
        } else {
            res += text[i];
            --i;
        }
        //console.println((count++) + ") Code: " + text[i] + "_left = " + l + ", " + text[i + 1] + "_right = " + r);
    }
    app.endPriv();
    return res;
});

//for menu items
var menuSections = {
    "additional": {
        "RUS": decode("Дополнительно"),
        "ENG": "Additional"
    },
    "formatDetection": {
        "RUS": decode("Формат страниц"),
        "ENG": "Page format"
    },
    "newDocument": {
        "RUS": decode("Новый документ"),
        "ENG": "New document"
    },
    "closeTabs": {
        "RUS": decode("Закрыть все вкладки"),
        "ENG": "Close all tabs"
    },
    "invertRange": {
        "RUS": decode("Инвертировать диапазон"),
        "ENG": "Invert the range"
    },
    "rotatePages": {
        "RUS": decode("Поворот страниц"),
        "ENG": "Rotate pages"
    },
    "extractPages": { 
        "RUS": decode("Извлечение страниц"),
        "ENG": "Extraction pages"
    },
    "numberingPages": {
        "RUS": decode("Нумерация страниц"),
        "ENG": "Numbering pages"
    },
    "sortingPages": {
        "RUS": decode("Сортировка страниц"),
        "ENG": "Sorting pages"
    },
    "reverseOrder": { 
        "RUS": decode("Обратить порядок страниц"),
        "ENG": "Reverse the page order",
        "newDoc": {
            "RUS": decode("Создать новый документ"),
            "ENG": "New document"
        },
        "sameDoc": {
            "RUS": decode("В этом документе"), 
            "ENG": "Same document"
        }
    },
    "help": { 
        "RUS": decode("Помощь"),
        "ENG": "Help"
    },
    "language": {
        "name": {
            "RUS": decode("Язык"), 
            "ENG": "Language",
        },
        "russian": decode("русский"),
        "english": "english",
    },
    "sign": {
        "short": "\u00a9 qeuty",
        "mail": "qeuty@yandex.ru"
    }
};

//for the dialog box menu items
var dialogBoxes = {
    "formatDetection": { // Определение форматов
        "title": {
            "RUS": decode("Показать интервалы"),
            "ENG": "Show Ranges"
        },
        "repOptions": {
            "RUS": decode("Параметры отчёта"),
            "ENG": "Report's parameters"
        },
        "mergeLP": { 
            "RUS": decode("Показать страницы альбомной и портретной\nориентации в одном диапазоне"),
            "ENG": "Show the landscape and portrait pages in the same range"
        },
        "splitLP": { 
            "RUS": decode("Показать страницы альбомной и портретной\nориентации в разных диапазонах"),
            "ENG": "Show the landscape and portrait pages in different range"
        },
        "additional": {
            "RUS": decode("Дополнительно"),
            "ENG": "Additional"
        },
        "verbose": {
            "RUS": decode("Показать детальный отчет для каждой страницы"),
            "ENG": "Show a detailed report for each pages"
        },
        "unknProcTitle": {
            "RUS": decode("Обработка нераспознанных форматов"),
            "ENG": "Processing unrecognized formats"
        },
        "unknToISO": {
            "RUS": decode("считать как наиболее подходящий ISO"),
            "ENG": "consider as the most appropriate ISO"
        },
        "unknToA4": { // 
            "RUS": decode("включать в диапазон формата A4"),
            "ENG": "include in the A4 format range"
        },
        "auxiliary": { 
            "RUS": decode("Вспомогательные инструменты"),
            "ENG": "Auxiliary tools"
        },
        "a3_as_a4": { 
            "RUS": decode("считать формат А3 как А4"),
            "ENG": "consider A3 format as A4"
        },
        "a3a2_as_a4": { 
            "RUS": decode("считать формат A3/A2 как A4"),
            "ENG": "consider A3/A2 format as A4"
        }
    },

    "invertRange": { //Инвертировать диапазон
        "description": { 
            "RUS": decode("Формат ввода [ 1 , 2 , 4 - 5 , 8 ] или [ 1 ; 2 ; 4 - 5 ; 8 ].\nНа выходе получится инвертированный диапазон [ 3 , 6 - 7 ]"),
            "ENG": "The input format is [ 1 , 2 , 4 - 5 , 8 ] or [ 1 ; 2 ; 4 - 5 , 8 ].\nAfter processing, the range [ 3 , 6 - 7 ] should be obtained"
        },
        "input": { 
            "RUS": decode("Ввод"),
            "ENG": "Input"
        },
        "result": { 
            "RUS": decode("Результат"),
            "ENG": "Result"
        },
        "docNamePrefix": { 
            "RUS": decode("Инвертированный диапазон для документа:\n"),
            "ENG": "The inverting range for document:\n"
        }
    },

    "rotatePages": {
        "explanation": { 
            "RUS": decode("Пояснения"),
            "ENG": "Explanations"
        },
        "clockwise": { 
            "RUS": decode("\u2663 По часовой стрелке: +90\u00B0"),
            "ENG": "\u2663 Clockwise +90\u00B0"
        },
        "counterclockwise": { 
            "RUS": decode("\u2663 Против часовой стрелки: -90\u00B0"),
            "ENG": "\u2663 Counterclockwise -90\u00B0"
        },
        "wideDescription": { 
            "RUS": decode("Страницы альбомной ориентации"),
            "ENG": "Select to rotate LANDSCAPE pages"
        },
        "tallDescription": { 
            "RUS": decode("Страницы портретной ориентации"),
            "ENG": "Select to rotate PORTRAIT pages"
        },
        "upToRight": {
            "RUS": decode("повернуть на +90\u00B0"),
            "ENG": "rotate the pages +90\u00B0"
        },
        "upToLeft": {
            "RUS": decode("повернуть на -90\u00B0"),
            "ENG": "rotate the pages -90\u00B0"
        },
        "turn": { // Повернуть на  180°
            "RUS": decode("повернуть на 180\u00B0"),
            "ENG": "Rotate the pages 180\u00B0"
        },
        "return": { // Вернуть все в 0°
            "RUS": decode("вернуть все в 0\u00B0"),
            "ENG": "Return all pages to 0\u00B0"
        },
        "extra": { 
            "RUS": decode("Дополнительно"),
            "ENG": "Extra"
        }
    },

    "extractPages": {
        "explanation": { 
            "RUS": decode("Задать диапазон страниц для извлечения\n(формат ввода [ 1 , 2 , 3 - 5 ] или [ 1 ; 2 ; 3 - 5 ])"),
            "ENG": "List the pages to be extracted\n(input format [ 1 , 2 , 3 - 5 ] or [ 1 ; 2 ; 3 - 5 ])"
        },
        "label": { 
            "RUS": decode("Страницы для извлечения"),
            "ENG": "Pages to extract"
        }
    },

    "numberingPages": {
        "explanation": { 
            "RUS": decode("По умолчанию нумерация добавляется сверху,\nчтобы изменить её расположение, нужно отметить\nсоответствующий пункт (все размеры в миллиметрах)"),
            "ENG": "the numbering will be added from the top, to add\nthe numbering from the bottom, set the appropriate\ncheck-box (all dimensions are in millimeters)"
        },
        "position": { 
            "RUS": decode("Настройка расположения"),
            "ENG": "Position settings"
        },
        "left": { 
            "RUS": decode("Слева"),
            "ENG": "Left"
        },
        "center": { 
            "RUS": decode("По центру"),
            "ENG": "Center"
        },
        "right": { 
            "RUS": decode("Справа"),
            "ENG": "Rigth"
        },
        "bottom": { 
            "RUS": decode("Снизу"),
            "ENG": "Bottom"
        },
        "indentionsAndAlign": { 
            "RUS": decode("Отступы и выравнивание"),
            "ENG": "Indentions and align"
        },
        "xMargins": {
            "RUS": decode("по оси X"),
            "ENG": "the X-axis"
        },
        "yMargins": { 
            "RUS": decode("по оси Y"),
            "ENG": "the Y-axis"
        },
        "font": { 
            "RUS": decode("Шрифт"),
            "ENG": "Font"
        },
        "size": { 
            "RUS": decode("Размер"),
            "ENG": "Size"
        },
        "borderSet": { 
            "RUS": decode("Настройка границ и обводки"),
            "ENG": "Border settings"
        },
        "style": { 
            "RUS": decode("Вид"),
            "ENG": "Style"
        },
        "align": { 
            "RUS": decode("выравнивание"),
            "ENG": "alignment"
        },
        "width": { 
            "RUS": decode("Ширина"),
            "ENG": "Width"
        },
        "height": { 
            "RUS": decode("Высота"),
            "ENG": "Height"
        },
        "numberTools": { 
            "RUS": decode("Настройка нумерации"),
            "ENG": "Number tools"
        },
        "firstNum": {
            "RUS": decode("Номер первой страницы"),
            "ENG": "First page number"
        },
        "restartNumIf": { 
            "RUS": decode("Начинать нумерацию заново после номера"),
            "ENG": "Restart numbering, if the page number is"
        },
        "numberingRange": {
            "RUS": decode("Диапазон нумерации"),
            "ENG": "Set the range numbering"
        },
        "activate": {
            "RUS": decode("Задать диапазон нумерации"),
            "ENG": "Activate range numbering settings"
        },
        "from": { 
            "RUS": decode("Начать с"),
            "ENG": "From"
        },
        "to": { 
            "RUS": decode("до"),
            "ENG": "to"
        },
        "toLastPage": { 
            "RUS": decode("до последней страницы"),
            "ENG": "to last page"
        },
        "fineTune": { 
            "RUS": decode("Более точная настройка"),
            "ENG": "Use this for tune fine"
        },
        "incrementSet": { 
            "RUS": decode("Настройки изменения нумерации"),
            "ENG": "Activate the increment settings"
        },
        "pageIncrement": { 
            "RUS": decode("Шаг постраничного изменения\n(приращение страниц)"),
            "ENG": "page increment"
        },
        "numIncrement": { 
            "RUS": decode("Шаг увеличения нумерации\n(приращение нумерации)"),
            "ENG": "number increment"
        },
        "insertText": { 
            "RUS": decode("Добавить текст (не забывать вставлять пробелы, где необходимо)"),
            "ENG": "Insert text (don't forget to put spaces)"
        },
        "before": { 
            "RUS": decode("До"),
            "ENG": "Before"
        },
        "after": { 
            "RUS": decode("После"),
            "ENG": "After"
        },
        "totalPageNum": { 
            "RUS": decode("Вставить общее количество страниц"),
            "ENG": "Insert total number of pages"
        }
    },

    "sortingPages": {
        "label": { 
            "RUS": decode("Выбор вида сортировки"),
            "ENG": "Choosing the type of sorting"
        },
        "decreasing": { 
            "RUS": decode("Сортировка по убыванию"),
            "ENG": "Sort in descending order"
        },
        "ascending": { 
            "RUS": decode("Сортировка по возрастанию"),
            "ENG": "Sort in ascending order"
        }
    },

    "buttons": {
        "start": {
            "RUS": decode("Старт"),
            "ENG": "Start"
        },
        "cancel": { 
            "RUS": decode("Закрыть"),
            "ENG": "Cancel"
        },
        "clear": { 
            "RUS": decode("Очистить"),
            "ENG": "Clear"
        }
    }
};

//for alerts, progress-bar and reports
var infoBoxes = {
    "progressText": {
        "pageProcess": { 
            "RUS": decode("Обработка страницы"),
            "ENG": "Processing page "
        },
        "from": { 
            "RUS": decode(" из "),
            "ENG": " of "
        },
        "verbose": {
            "RUS": decode("Подготовка подробного отчета...\nМожет занять некоторое время"),
            "ENG": "Preparation of a datailed report...\n(sometimes it takes a fucking long time)"
        }
    },
    "icon": {
        "error": 0,
        "warning": 1,
        "question": 2,
        "status": 3
    },
    "outnumber": {
        "RUS": decode("Этот номер страницы превышает число страниц в документе: "),
        "ENG": "This number exceeds the number of pages in the document: "
    },
    "wrongChar": {
        "RUS": decode("Введенный интервал должен содержать только цифры [ 0-9 ], запятые [ , ], точку с запятой [ ; ], дефис [ - ], пробелы [   ]: "),
        "ENG": "The range should contain only the digits [ 0-9 ], the commas [ , ], the colones [ ; ], the dashes [ - ] and the spaces [   ]: "
    },
    "wrongBorders": {
        "RUS": decode("Последовательность не может содержать символы запятая [ , ], точка с запятой [ ; ], дефис [ - ] в начале или в конце"),
        "ENG": "The sequence cannot contain characters comma [ , ], colon [ ; ], dash [ - ] at the beginning or at the end of the range"
    },
    "wrongSequence": {
        "RUS": decode("Неверный интервал, левая граница не должна быть больше или равна правой\n"),
        "ENG": "The invalid range: the value of the left bound of the interval cannot be greater or equal the value of the right bound of the interval:\n"
    },
    "duplication": {
        "RUS": decode("Последовательность не может содержать идущие подряд разделители: запятая [ , ], точка с запятой [ ; ], дефис [ - ]"),
        "ENG": "The range should not contain two or more consecutive delimiters: comma [ , ], colon [ ; ], dash [ - ]"
    },
    "sortError": { 
        "RUS": decode("Видимо, есть проблема с данным документом (ошибка 15).\n\nЧтобы её устранить, можно попробовать удалить из него теги. Нужно перейти в меню \"Просмотр\" / \"Показать / скрыть\" /\n\"Области навигации\" / \"Теги\", выделить самый верхний тег,\nзатем в контекстном меню выбрать пункт \"Удалить тег\".\n\nЧтобы открыть обработанную часть выберите \"Ок\", закрыть \"Отмена\".\n\nОписание ошибки: "),
        "ENG": "There was a problem reading this document (15)/ error 15.\n\nFor a solutinon, try to remove the tags from your document (go to View/Show-Hide/Navigation Pane/Tags and delete the tags\n\nIf you want to open the part has been comleted press \"Ok\", otherwise \"Cancel\"\n\nError description: "
    },
    "reverseError": { 
        "RUS": decode("Видимо, есть проблема с данным документом (ошибка 15).\n\nЧтобы её устранить, можно попробовать удалить из него теги. Нужно перейти в меню \"Просмотр\" / \"Показать / скрыть\" /\n\"Области навигации\" / \"Теги\", выделить самый верхний тег,\nзатем в контекстном меню выбрать пункт \"Удалить тег\".\n\nОписание ошибки: "),
        "ENG": "There was a problem reading this document (15)/ error 15.\n\nFor a solutinon, try to remove the tags from your document (go to View/Show-Hide/Navigation Pane/Tags and delete the top tag\n\nError description: "
    },
    "alreadySort": { 
        "RUS": decode("Уже отсортировано!!!"),
        "ENG": "Already sorted!!!"
    },
    "successSort": { // Сортировка выполнена
        "RUS": decode("Сортировка выполнена"),
        "ENG": "Sorting is done!!!"
    },
    "successRotate": { 
        "RUS": decode("Операция завершена.\n"),
        "ENG": "The operation is completed.\n",
        "turn": {
            "RUS": decode("стр. повернуто\n"),
            "ENG": "pages were rotated\n"
        },
        "return": { 
            "RUS": decode("стр. возвращено в исходное состояние\n"),
            "ENG": "pages were returned to the original state\n"
        }
    },
    "successReverse": { 
        "RUS": decode("Порядок страниц изменён!!!"),
        "ENG": "Page order has been changed!!!"
    }
    ,
    "langSwitch": { 
        "RUS": decode("Выбран русский язык. Требуется перезапустить приложение"),
        "ENG": "English was selected. You need to restart the application"
    },
    "report": {
        "title": {  
            "RUS": decode("Форматы страниц для"),
            "ENG": "Pages sizes for the"
        },
        "tabName": { 
            "RUS": decode("Отчет для"),
            "ENG": "Report for"
        },
        "page": { 
            "RUS": decode("Страница"),
            "ENG": "Page"
        },
        "from": {
            "RUS": decode("из"),
            "ENG": "of"
        },
        "fullReport": {
            "RUS": decode("Полный отчёт по каждому формату"),
            "ENG": "Full report on each format"
        },
        "pagesAt": {
            "RUS": decode("Страницы формата"),
            "ENG": "Pages at"
        },
        "land": {
            "RUS": decode("альбомные"),
            "ENG": "landscape"
        },
        "port": {
            "RUS": decode("портретные"),
            "ENG": "portrait"
        },
        "total": {
            "RUS": decode("всего"),
            "ENG": "total"
        },
        "uTitle": {
            "RUS": decode("Отчет для страниц, размеры которых сложно сопоставить с известными форматами (с соотношением сторон 1:1 или длиной короткой стороны более 1219 мм)"),
            "ENG": "Report for \"Unknow\" pages\n(ratio ~ 1:1 (as square) or the smaller side of the page is larger than 1219 mm)"
        },
        "quantity": {
            "RUS": decode("Количество"),
            "ENG": "Quantity"
        },
        "ofAll": {
            "RUS": decode("от общего числа страниц"),
            "ENG": "of all pages"
        },
        "totalNumPage": {
            "RUS": decode("Общее количество страниц"),
            "ENG": "Total number of page"
        },
        "analized": {
            "RUS": decode("Проанализировано"),
            "ENG": "Total number of page"
        },
        "startTime": {
            "RUS": decode("Время начала"),
            "ENG": "Start time"
        },
        "execTime": {
            "RUS": decode("Время выполнения"),
            "ENG": "Execution time"
        }
        ,
        "quote": "\nThis is the end\nMy only friend, the end...\n"
    },
    "date": {
        "sec": {
            "RUS": decode("сек"),
            "ENG": "sec"
        },
        "min": {
            "RUS": decode("мин"),
            "ENG": "min"
        }
    }
}

//___________________________________________________________________________________________________________MENU_START

//________________________________________________ADDITIONAL_SUBMENU_________________________________________
app.addSubMenu({
    cName: "additional",
    cUser: menuSections.additional[global.gLang],
    cParent: "Edit",
    nPos: 0
})

//format detection
app.addMenuItem({
    cName: "fTest",
    cUser: menuSections.formatDetection[global.gLang],
    cParent: "additional",
    cExec: "strartTest()",
    nPos: 0,
    cEnable: "event.rc=(event.target != null);"
});

//separator
app.addMenuItem({
    cName: "-",
    cUser: "-",
    cExec: "-",
    cParent: "additional",
    nPos: 1
});

//new document
app.addMenuItem({
    cName: "makeNewDoc",
    cUser: menuSections.newDocument[global.gLang],
    cParent: "additional",
    cExec: "makeNewDoc()",
    nPos: 2,
})

//close tabs
app.addMenuItem({
    cName: "closeTabs",
    cUser: menuSections.closeTabs[global.gLang],
    cParent: "additional",
    cExec: "closeTabs()",
    npos: 3,
    cEnable: "event.rc=(event.target != null);"
})

//separator
app.addMenuItem({
    cName: "-",
    cUser: "-",
    cExec: "-",
    cParent: "additional",
    nPos: 4
});

//invert range
app.addMenuItem({
    cName: "invertRange",
    cUser: menuSections.invertRange[global.gLang],
    cParent: "additional",
    cExec: "showInvertRangeDialog()",
    nPos: 5,
    cEnable: "event.rc=(event.target != null);"
});

//rotate pages
app.addMenuItem({
    cName: "rotateDialog",
    cUser: menuSections.rotatePages[global.gLang],
    cParent: "additional",
    cExec: "showRotateDialog();",
    nPos: 6,
    cEnable: "event.rc=(event.target != null);"
});

//extract pages
app.addMenuItem({
    cName: "extractPages",
    cUser: menuSections.extractPages[global.gLang],
    cParent: "additional",
    cExec: "showExtractPagesDialog();",
    nPos: 7,
    cEnable: "event.rc=(event.target != null);"
});

//numbering
app.addMenuItem({
    cName: "addNumbering",
    cUser: menuSections.numberingPages[global.gLang],
    cParent: "additional",
    cExec: "showNumberingPagesDialog();",
    nPos: 8,
    cEnable: "event.rc=(event.target != null);"
});

//sorting
app.addMenuItem({
    cName: "sortingPages",
    cUser: menuSections.sortingPages[global.gLang],
    cParent: "additional",
    cExec: "showSortingPagesDialog()",
    nPos: 9,
    cEnable: "event.rc=(event.target != null);"
});

//________________________________________________REVERSE_SUBMENU_________________________________________
app.addSubMenu({
    cName: "reverseOrder",
    cUser: menuSections.reverseOrder[global.gLang],
    cParent: "additional",
    nPos: 10,
});

app.addMenuItem({
    cName: "reverseNew",
    cUser: menuSections.reverseOrder.newDoc[global.gLang],
    cParent: "reverseOrder",
    cExec: "reverseOrderNew()",
    nPos: 0,
    cEnable: "event.rc=(event.target != null);"
});

app.addMenuItem({
    cName: "reverseSame",
    cUser: menuSections.reverseOrder.sameDoc[global.gLang],
    cParent: "reverseOrder",
    cExec: "reverseOrderSame()",
    nPos: 1,
    cEnable: "event.rc=(event.target != null);"
});

//separator
app.addMenuItem({
    cName: "-",
    cUser: "-",
    cExec: "-",
    cParent: "additional",
    nPos: 11
});


//________________________________________________HELP_SUBMENU_________________________________________

//help
app.addSubMenu({
    cName: "help",
    cUser: menuSections.help[global.gLang],
    cParent: "additional",
    nPos: 12,
});

//api
app.addMenuItem({
    cName: "api",
    cUser: "Acrobat JS API Ref",
    cParent: "help",
    cExec: "openJSapiURL()",
    nPos: 0
});

//community
app.addMenuItem({
    cName: "community",
    cUser: "Community",
    cParent: "help",
    cExec: "openCommunityURL()",
    nPos: 1
});

//yandex
app.addMenuItem({
    cName: "ya",
    cUser: "ExtraHelp",
    cParent: "help",
    cExec: "openYandexURL()",
    nPos: 2
});

//________________________________________________LANG_SUBMENU_________________________________________
app.addSubMenu({
    cName: "language",
    cUser: menuSections.language.name[global.gLang],
    cParent: "additional",
    nPos: 13
});

app.addMenuItem({
    cName: "rus",
    cUser: menuSections.language.russian,
    cParent: "language",
    cExec: "changeLang('RUS')",
    nPos: 1
});

app.addMenuItem({
    cName: "eng",
    cUser: menuSections.language.english,
    cParent: "language",
    cExec: "changeLang('ENG')",
    nPos: 2
});


//______________________________________________________________________________________________________MENU_END



//============================================SHARE FUNCTIONS============================================

barText = app.trustPropagatorFunction(function (funcName, current) {
    // "FORMAT DETECTION\nProcessing page " + (countPage + 1) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
    app.beginPriv();
    var percent = ((current + 1) / this.numPages) * 100;
    var result = funcName.toUpperCase() + "\n" + infoBoxes.progressText.pageProcess[global.gLang] + " " + current + infoBoxes.progressText.from[global.gLang] + this.numPages + " (" + percent.toFixed() + " %)";
    app.endPriv();
    return result;
});

var Alerter = app.trustedFunction(function (message, icon = 3, addInfo = "") {
    app.beginPriv();
    var ret = app.alert({
        cMsg: infoBoxes[message][global.gLang] + addInfo,
        cTitle: "Buon giorno, Signor Pantalone!",
        nIcon: icon,
        nType: message == "sortError" ? 1 : 0,
    })
    app.endPriv();
    return ret;
});

insertionSort = app.trustedFunction(function (pages, compare) {
    app.beginPriv();
    var isSorted = true;
    for (var i = 1; i < pages.length; ++i) {
        var key = pages[i];
        var j = i - 1;
        while (j >= 0 && compare(pages[j].size, key.size)) {
            isSorted = false;
            pages[j + 1] = pages[j];
            --j;
        }
        pages[j + 1] = key;
    }
    app.endPriv();
    return isSorted;
});

//use at function extractPages() and invertRange()
isTrueChar = app.trustedFunction(function (ch) {
    app.beginPriv();
    var trueCharSet = [32, 44, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59];// ASCI-codes for comma[,], colon[;], dash[-], space[ ] and digits [0-9]
    for (var i = 0; i < trueCharSet.length; ++i) {
        if (trueCharSet[i] == ch.charCodeAt(0)) {
            return true;
        }
    }
    app.endPriv();
    return false;
});

//use at function extractPages() and invertRange()
hasWrongBorders = app.trustedFunction(function (sequence) {
    app.beginPriv();
    var delimiters = ",;-";
    var result = (delimiters.indexOf(sequence[0]) + delimiters.indexOf(sequence[sequence.length - 1]) != -2);
    app.endPriv();
    return result;
});

//============================================CHANGE LANGUAGE============================================

changeLang = app.trustedFunction(function (lang) {
    app.beginPriv();
    global.gLang = lang;
    Alerter("langSwitch", infoBoxes.icon.status);
    app.endPriv();
});

//============================================EXTRACT PAGES============================================

addPagesForExtract = app.trustedFunction(function (pagesDB, rhs) {
    var lhs = pagesDB[pagesDB.length - 1] + 1;
    if (lhs > rhs) {
        return false;
    }
    while (lhs <= rhs) {
        pagesDB.push(lhs++);
    }
    return true;
});


showExtractPagesDialog = app.trustedFunction(function () {
    app.beginPriv();
    var input = app.response({
        cQuestion: dialogBoxes.extractPages.explanation[global.gLang],
        cTitle: menuSections.extractPages[global.gLang],
        cLabel: dialogBoxes.extractPages.label[global.gLang]
    });
    var pagesForExtract = new Array();
    var buffer = "";
    var isPrevDelimiter = false;
    var isPrevDash = false;
    if (input) {
        if (hasWrongBorders(input)) {
            Alerter("wrongBorders", infoBoxes.icon.error);
            return;
        }
        for (var i = 0; i < input.length; ++i) {
            if (input[i] != " ") {
                if (!isTrueChar(input[i])) {
                    Alerter("wrongChar", infoBoxes.icon.error, input[i]);
                    return;
                }
                if (input[i] != "," && input[i] != ";" && input[i] != "-") {
                    buffer += input[i];
                    isPrevDelimiter = false;
                } else if (input[i] == "," || input[i] == ";") {
                    if (isPrevDelimiter) {
                        Alerter("duplication", infoBoxes.icon.error);
                        return;
                    }
                    isPrevDelimiter = true;
                    var rhs = parseInt(buffer);
                    if (isPrevDash) {
                        if (!addPagesForExtract(pagesForExtract, rhs)) {
                            return;
                        }
                        isPrevDash = false;
                    } else {
                        pagesForExtract.push(rhs);
                    }
                    buffer = "";
                } else {
                    isPrevDelimiter = isPrevDash = true;
                    pagesForExtract.push(parseInt(buffer));
                    buffer = "";
                }
            }
        }
        var rhs = parseInt(buffer);
        if (isPrevDash) {
            if (!addPagesForExtract(pagesForExtract, rhs)) {
                return;
            }
        } else {
            pagesForExtract.push(rhs);
        }

        var p = this.path;
        var myDoc = app.newDoc();
        var progressBar = app.thermometer;
        progressBar.duration = pagesForExtract.length;
        progressBar.begin();
        try {
            for (var i = 0; i < pagesForExtract.length; ++i) {
                progressBar.value = i;
                progressBar.text = barText(menuSections.extractPages[global.gLang], i, pagesForExtract.length);
                if (progressBar.cancelled) break;
                myDoc.insertPages({
                    nPage: i - 1,
                    cPath: p,
                    nStart: pagesForExtract[i] - 1
                });
            }
            myDoc.deletePages({ nStart: pagesForExtract.length });
            progressBar.end();
        } catch (e) {
            progressBar.end();
            app.alert(e.message);
            myDoc.closeDoc(true);
        }
    }
    app.endPriv();
});

//============================================REVERSE ORDER============================================

reverseOrderSame = app.trustedFunction(function () {
    app.beginPriv();
    var progressBar = app.thermometer;
    progressBar.begin();
    progressBar.duration = this.numPages;
    try {
        for (var i = this.numPages - 1; i >= 0; --i) {
            progressBar.value = this.numPages - i;
            progressBar.text = barText(menuSections.reverseOrder[global.gLang], this.numPages - i, this.numPages);
            if (progressBar.cancelled) break;
            this.movePage(i);
        }
    } catch (e) {
        progressBar.end();
        console.println(e);
        Alerter("reverseError", infoBoxes.icon.error, e.message);
    }
    progressBar.end();
    app.endPriv();
})

reverseOrderNew = app.trustedFunction(function () {
    app.beginPriv();
    var p = this.path;
    var myDoc = app.newDoc();
    var progressBar = app.thermometer;
    progressBar.begin();
    progressBar.duration = this.numPages;
    try {
        for (var i = this.numPages - 1, j = 0; j < this.numPages; --i, ++j) {
            progressBar.value = j + 1;
            progressBar.text = barText(menuSections.reverseOrder[global.gLang], j, this.numPages);
            if (progressBar.cancelled) break;
            myDoc.insertPages({
                nPage: j - 1,
                cPath: p,
                nStart: i
            });
        }
        myDoc.deletePages({ nStart: this.numPages });
        progressBar.end();
        Alerter("successReverse", infoBoxes.icon.status);
    } catch (e) {
        progressBar.end();
        console.println(e);
        myDoc.closeDoc(true);
        Alerter("reverseError", infoBoxes.icon.error, e.message);
    }
    progressBar.end();
    app.endPriv();
})

//============================================CLOSE TABS============================================

closeTabs = app.trustedFunction(function () {
    app.beginPriv();
    var oDocs = app.activeDocs;
    for (var i = 0; i < oDocs.length; i++) {
        oDocs[i].closeDoc(true);
    }
    app.endPriv();
})

//============================================CREATE NEW DOCUMENT============================================

makeNewDoc = app.trustedFunction(function () {
    app.beginPriv();
    var myDoc = app.newDoc(595, 841); //will create A4 docunent, size in points/создает новый документ А4, размеры указаны в точках
    myDoc.zoomType = zoomtype.fitP;
    app.endPriv();
})

//============================================OPEN URLs============================================

openYandexURL = app.trustedFunction(function () {
    app.beginPriv();
    app.launchURL("http://www.yandex.com/", true);
    app.endPriv();
})

openCommunityURL = app.trustedFunction(function () {
    app.beginPriv();
    app.launchURL("https://community.adobe.com/t5/acrobat/ct-p/ct-acrobat?page=1&sort=latest_replies&lang=all&tabid=all", true);
    app.endPriv();
})

openJSapiURL = app.trustedFunction(function () {
    app.beginPriv();
    app.launchURL("https://opensource.adobe.com/dc-acrobat-sdk-docs/library/jsapiref/index.html", true);
    app.endPriv();
})

//============================================INVERT RANGE============================================

createInverseInterval = app.trustedFunction(function (lhs, rhs) {
    app.beginPriv();
    var res = "";
    var tmp = rhs - lhs;
    if (tmp <= 0) {
        throw new Error(infoBoxes.wrongSequence[global.gLang] + (tmp ? lhs + " > " + rhs : lhs + " = " + rhs));
    }
    if (tmp > 1) {
        res += (rhs - lhs == 2) ? (lhs + 1) : ((lhs + 1) + "-" + (rhs - 1));
    }
    app.endPriv();
    return res;
});

inverseFunction = app.trustedFunction(function (input) {
    app.beginPriv();

    var result = "";

    if (hasWrongBorders(input)) {
        Alerter("wrongBorders", infoBoxes.icon.error);
        return result;
    }

    var totalCount = this.numPages;
    var couple = {
        "lhs": 0,
        "rhs": 0,
        "char": ""
    };

    var buffer = "";
    var isPrevDelimiter = false; //choose two delimiters in a row

    for (var i = 0; i <= input.length; ++i) {
        if (i < input.length && !isTrueChar(input[i])) {
            Alerter("wrongChar", infoBoxes.icon.error, (i + 1) + ") [ " + input[i] + " ]");
            return "";
        }
        if (i == input.length) {
            couple.rhs = parseInt(buffer);
            if (couple.rhs <= couple.lhs) {
                Alerter("wrongSequence", 1, (couple.lhs > couple.rhs ? couple.lhs + " > " + couple.rhs : couple.lhs + " = " + couple.rhs));
                return "";
            }
            if (couple.rhs > this.numPages) {
                Alerter("outnumber", infoBoxes.icon.error, couple.rhs);
                return "";
            }
            if (couple.char != "-") {
                try {
                    var tmp = createInverseInterval(couple.lhs, couple.rhs);
                } catch (e) {
                    app.alert(e.message);
                    return "";
                }
                result += ((tmp != "" && result != "") ? "," : "") + tmp;
            }

            if (totalCount - couple.rhs == 1) {
                result += ((result != "") ? "," : "") + totalCount;
            } else if (totalCount - couple.rhs >= 2) {
                result += ((result != "") ? "," : "") + (couple.rhs + 1) + "-" + totalCount;
            }
        }
        if (input[i] != " ") {

            if (input[i] != "," && input[i] != ";" && input[i] != "-") {
                buffer += input[i];
                isPrevDelimiter = false;
            } else {
                if (isPrevDelimiter) {
                    Alerter("duplication", infoBoxes.icon.error, "\n[ index " + i + " ] " + input[i - 1] + "\n[ index " + (i + 1) + " ] " + input[i]);
                    return "";
                } else {
                    isPrevDelimiter = true;
                }
                if (couple.lhs == 0) {
                    couple.lhs = parseInt(buffer);
                    if (couple.lhs > this.numPages) {
                        Alerter("outnumber", infoBoxes.icon.error);
                        return "";
                    }
                    if (couple.lhs == 2) {
                        result += 1;
                    } else if (couple.lhs > 2) {
                        result += 1 + "-" + (couple.lhs - 1);
                    }
                } else {
                    couple.rhs = parseInt(buffer);
                    if (couple.rhs <= couple.lhs) {
                        Alerter("errorSequence", infoBoxes.icon.error, (couple.lhs > couple.rhs ? couple.lhs + " > " + couple.rhs : couple.lhs + " = " + couple.rhs));
                        return "";
                    }
                    if (couple.rhs > this.numPages) {
                        Alerter("outnumber", infoBoxes.icon.error, couple.rhs);
                        return "";
                    }
                    if (couple.char == "," || couple.char == ";") {
                        try {
                            var tmp = createInverseInterval(couple.lhs, couple.rhs);
                        } catch (e) {
                            app.alert(e.message);
                            return "";
                        }
                        result += ((tmp != "" && result != "") ? "," : "") + tmp;
                    }
                    couple.lhs = couple.rhs;
                    couple.rhs = 0;
                }
                couple.char = input[i];
                buffer = "";
            }
        }
    }
    app.endPriv();
    return result;
});

invertedOutput = app.trustedFunction(function (message) {
    app.beginPriv();
    app.response({
        cQuestion: dialogBoxes.invertRange.docNamePrefix[global.gLang] + "\"" + this.documentFileName + "\"",
        cTitle: dialogBoxes.invertRange.result[global.gLang],
        cDefault: message
    });
    app.execMenuItem("SelectAll");
    app.endPriv();
});

showInvertRangeDialog = app.trustedFunction(function () {
    app.beginPriv();

    var inverseDialog = {
        strt: function (dialog) {
            var results = dialog.store();
            var inverseResult = inverseFunction(results["inpt"]);
            if (inverseResult != "") {
                invertedOutput(inverseResult)
            }
        },
        cncl: function (dialog) {
            dialog.end("cancel")
        },
        description:
        {
            name: menuSections.invertRange[global.gLang],
            width: 320,
            align_children: "align_left",
            elements:
                [
                    {
                        type: "view",
                        width: 320,
                        elements: [{
                            type: "static_text",
                            width: 320,
                            height: 35,
                            alignment: "align_center",
                            name: dialogBoxes.invertRange.description[global.gLang]
                        },
                        {
                            type: "cluster",
                            width: 320,
                            align_children: "align_fill",
                            elements:
                                [
                                    {
                                        type: "view",
                                        elements:
                                            [
                                                {
                                                    type: "static_text",
                                                    name: dialogBoxes.invertRange.input[global.gLang]
                                                },
                                                {
                                                    item_id: "inpt",
                                                    type: "edit_text",
                                                    name: "input",
                                                    multiline: true,
                                                    alignment: "align_fill",
                                                    height: 100
                                                }
                                            ]
                                    }
                                ]
                        },
                        {
                            type: "view",
                            width: 245,
                            align_children: "align_row",
                            elements: [, {
                                type: "button",
                                alignment: "align_fill",
                                name: dialogBoxes.buttons.start[global.gLang],
                                item_id: "strt"
                            }, {
                                    type: "button",
                                    alignment: "align_fill",
                                    name: dialogBoxes.buttons.cancel[global.gLang],
                                    item_id: "cncl"
                                }]
                        }
                        ]
                    }]
        }
    };

    app.execDialog(inverseDialog);
    app.endPriv();
});

//============================================SORTING PAGES============================================

showSortingPagesDialog = app.trustedFunction(function () {
    app.beginPriv();
    var SortDialog = {
        check: {},
        initialize: function (dialog) {
            dialog.load({ "rd01": true });
        },
        commit: function (dialog) {
            var sourse = dialog.store();
            for (var i = 1; i < 3; i++) {
                if (sourse["rd0" + i])
                    this.check["rd0" + i] = sourse["rd0" + i];
            }
        },
        cancel: function (dialog) {
            dialog.end("cancel");
        },
        description: {
            name: menuSections.sortingPages[global.gLang],
            align_children: "align_left",
            elements: [{
                type: "view",
                elements: [{
                    type: "view",
                    name: dialogBoxes.sortingPages.label[global.gLang],
                    align_children: "align_left",
                    elements: [{
                        type: "radio",
                        item_id: "rd01",
                        group_id: "rado",
                        name: dialogBoxes.sortingPages.ascending[global.gLang],
                    },
                    {
                        type: "radio",
                        item_id: "rd02",
                        group_id: "rado",
                        name: dialogBoxes.sortingPages.decreasing[global.gLang],
                    }
                    ]
                }, {
                    type: "view",
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: menuSections.sign.short,
                        font: "palette"
                    }, {
                        type: "ok_cancel",
                        ok_name: dialogBoxes.buttons.start[global.gLang],
                        cancel_name: dialogBoxes.buttons.cancel[global.gLang],
                    }]
                }
                ]
            },]
        }
    };
    var showSortDialogInit = app.execDialog(SortDialog);

    if ("ok" == String(showSortDialogInit)) {

        var progressBar = app.thermometer;
        progressBar.duration = this.numPages;
        progressBar.begin();
        var nr = 2.834;
        var pagesDB = [{ "page_num": 0, "size": 0 }];
        var isSorted = true;

        //определение форматов
        for (var i = 0; i < this.numPages; i++) {
            progressBar.value = i;
            percent = ((i + 1) / this.numPages) * 100;
            progressBar.text = "FORMATS DETECTION\nProcessing " + percent.toFixed() + " %";
            if (progressBar.cancelled) break;
            var ip = this.getPageBox("Crop", i);
            iWidth = (ip[2] - ip[0]) / nr;
            iHeight = (ip[1] - ip[3]) / nr;
            pagesDB[i] = { "page_num": i, "size": iWidth + iHeight };
        }
        progressBar.end();

        // inaccuracy 20 mm
        isSorted = (SortDialog.check.rd01)
            ? insertionSort(pagesDB, (lhs, rhs) => lhs - rhs > 20)
            : insertionSort(pagesDB, (lhs, rhs) => lhs - rhs < 20);

        if (isSorted) {
            Alerter("alreadySort", infoBoxes.icon.status);
            return;
        }

        try {
            var p = this.path;
            var myDoc = app.newDoc();

            progressBar.duration = pagesDB.length;
            progressBar.begin();
            for (var i = 0; i < pagesDB.length; ++i) {
                progressBar.value = i;
                percent = ((i + 1) / pagesDB.length) * 100;
                progressBar.text = "PAGES SORTING\nProcessing " + percent.toFixed() + " %";
                if (progressBar.cancelled) break;
                myDoc.insertPages({
                    nPage: i - 1,
                    cPath: p,
                    nStart: pagesDB[i].page_num
                });
            }
            myDoc.deletePages({ nStart: pagesDB.length });
            progressBar.end();
            myDoc.layout = app.viewerVersion >= 6 ? "TwoPageLeft" : "TwoColumnLeft";
            myDoc.zoomType = zoomtype.fitP;

            Alerter("successSort", infoBoxes.icon.status);

            app.endPriv();
        } catch (e) {
            progressBar.text = "Adobe Acrobat DC";
            progressBar.end();

            var choice = Alerter("sortError", infoBoxes.icon.error, e.message);

            if (choice == 2) {
                myDoc.closeDoc(true);
            }
            app.endPriv();
        }
    }
});

//============================================NUMBERING============================================

showNumberingPagesDialog = app.trustedFunction(function () {
    app.beginPriv();
    var dialogNum = {
        check: {},
        initialize: function (dialog) {
            this.activeCheck = false;
            this.activeCheck1 = false;
            this.activeCheck2 = false;
            dialog.load({ "frsp": 1..toFixed(), "rd10": true, "hrzn": 5..toFixed(), "vrtl": 5..toFixed(), "size": 10..toFixed(), "rght": true, "rngn": false, "rstr": false, "rngn": false, "chk1": 1..toFixed(), "chk2": 1..toFixed(), "fldw": 100..toFixed(), "fldh": 7..toFixed() });
            dialog.enable({ "chk1": false, "chk2": false, "rd03": this.activeCheck, "rd10": this.activeCheck1, "rd20": this.activeCheck1, "rstf": this.activeCheck2, "fr01": this.activeCheck1, "fr02": this.activeCheck1, "to01": this.activeCheck1 });
            this.loadDefaults(dialog);
        },
        commit: function (dialog) { // called when OK pressed
            var results = dialog.store();
            var fontName = results["font"];
            for (var i in fontName) {
                if (fontName[i] > 0)
                    this.check.fontName = i;
            }
            var borderStyle = results["brdr"];
            for (var i in borderStyle) {
                if (borderStyle[i] > 0)
                    this.check.borderStyle = i;
            }
            var lineWidth = results["thck"];
            for (var i in lineWidth) {
                if (lineWidth[i] > 0)
                    this.check.lineWidth = i;
            }
            var txtAlign = results["algn"];
            for (var i in txtAlign) {
                if (txtAlign[i] > 0)
                    this.check.txtAlign = i;
            }
            this.check.firstPageNumber = results["frsp"];
            this.check.hMargin = results["hrzn"];
            this.check.vMargin = results["vrtl"];
            this.check.fontSize = results["size"];
            this.check.rangeActivate = results["rngs"];
            this.check.rangeStartPage = results["fr01"];
            this.check.rangeEndPage = results["to01"];
            this.check.oneRange = results["rd10"];
            this.check.rangeOnlyStartPage = results["fr02"];
            this.check.restartNumActivate = results["rstr"];
            this.check.restartNumValue = results["rstf"];
            this.check.additionalActivate = results["rngn"];
            this.check.textBefore = results["txtb"];
            this.check.textAfter = results["txta"];
            this.check.textBonus = results["ttaa"];
            this.check.positionLeft = results["left"];
            this.check.positionCenter = results["cntr"];
            this.check.positionBottom = results["bttm"];
            this.check.pageStep = results["chk1"];
            this.check.numberStep = results["chk2"];
            this.check.onlyOddWithoutEven = results["rd03"];
            this.check.fieldHeight = results["fldh"];
            this.check.fieldWidth = results["fldw"];
        },
        rngs: function (dialog) {
            this.activeCheck1 = !this.activeCheck1;
            var results = dialog.store();
            dialog.enable({ "rd10": this.activeCheck1, "rd20": this.activeCheck1, "fr01": results["rd10"] && this.activeCheck1, "to01": results["rd10"] && this.activeCheck1, "fr02": results["rd20"] && this.activeCheck1 })
        },
        rngn: function (dialog) {
            this.activeCheck = !this.activeCheck;
            dialog.enable({ "chk1": this.activeCheck, "chk2": this.activeCheck })
        },
        rstr: function (dialog) {
            this.activeCheck2 = !this.activeCheck2;
            dialog.enable({ "rstf": this.activeCheck2 });
        },
        rd10: function (dialog) {
            var results = dialog.store();
            dialog.enable({ "fr01": this.activeCheck1 && results["rd10"], "to01": this.activeCheck1 && results["rd10"], "fr02": this.activeCheck1 && results["rd20"] });
        },
        rd20: function (dialog) {
            var results = dialog.store();
            dialog.enable({ "fr01": this.activeCheck1 && results["rd10"], "to01": this.activeCheck1 && results["rd10"], "fr02": this.activeCheck1 && results["rd20"] });
        },
        other: function (dialog) {
            //dialog.end("other"); // End the dialog box, return "other"!
            POLICErevomeNumbering();
        },
        loadDefaults: function (dialog) {
            dialog.load({
                font: {
                    "Times-Roman": -1, // font.Times
                    "Times-Bold": -2, // font.TimesB
                    "Times-Italic": -3, // font.TimesI
                    "Times-BoldItalic": -4, // font.TimesBI
                    "Helvetica": 5, // font.Helv
                    "Helvetica-Bold": -6, // font.HelvB
                    "Helvetica-Oblique": -7, // font.HelvI
                    "Helvetica-BoldOblique": -8, // font.HelvBI
                    "Courier": -9, // font.Cour
                    "Courier-Bold": -10, // font.CourB
                    "Courier-Oblique": -11, // font.CourI
                    "Courier-BoldOblique": -12, // font.CourBI
                    "Symbol": -13, // font.Symbol
                    "ZapfDingbats": -14 // font.ZapfD
                },
                brdr: {
                    "Solid": 1, //border.s 
                    "Beveled": -1, //border.b 
                    "Dashed": -2, //border.d 
                    "Inset": -3, //border.i 
                    "Underline": -4, //border.u 
                },
                thck: {
                    "None": 1, //0
                    "Thin": -1, //1
                    "Medium": -2, //2
                    "Thick": -3 //3
                },
                algn: {
                    "Right": 1,
                    "Center": -1,
                    "Left": -2
                }
            })
        },
        description: {
            name: menuSections.numberingPages[global.gLang],
            align_children: "align_left",
            elements: [{
                type: "view",
                elements: [{
                    type: "cluster",
                    name: dialogBoxes.numberingPages.position[global.gLang],
                    align_children: "align_row",
                    elements: [{
                        type: "view",
                        align_children: "align_left",
                        elements: [{
                            type: "view",
                            align_children: "align_row",
                            //width: 280,
                            elements: [{
                                type: "radio",
                                name: dialogBoxes.numberingPages.left[global.gLang],
                                group_id: "pos1",
                                item_id: "left"
                            }, {
                                type: "radio",
                                name: dialogBoxes.numberingPages.center[global.gLang],
                                group_id: "pos1",
                                item_id: "cntr"
                            }, {
                                type: "radio",
                                name: dialogBoxes.numberingPages.right[global.gLang],
                                group_id: "pos1",
                                item_id: "rght"
                            }, {
                                type: "check_box",
                                name: dialogBoxes.numberingPages.bottom[global.gLang],
                                item_id: "bttm"
                            }]
                        }, {
                            type: "static_text",
                            height: 50,
                            alignment: "align_center",
                            name: dialogBoxes.numberingPages.explanation[global.gLang],
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "static_text",
                                name: dialogBoxes.numberingPages.font[global.gLang]
                            }, {
                                type: "popup",
                                item_id: "font",
                                width: 130,
                                height: 20
                            }, {
                                type: "static_text",
                                name: dialogBoxes.numberingPages.size[global.gLang],
                            }, {
                                type: "edit_text",
                                item_id: "size",
                                width: 40,
                                height: 20
                            }]
                        }]
                    }, {
                        type: "cluster",
                        name: dialogBoxes.numberingPages.indentionsAndAlign[global.gLang],
                        align_children: "align_left",
                        elements: [{
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "edit_text",
                                item_id: "hrzn",
                                width: 75,
                                height: 20
                            }, {
                                type: "static_text",
                                name: dialogBoxes.numberingPages.xMargins[global.gLang],
                            }]
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "edit_text",
                                item_id: "vrtl",
                                width: 75,
                                height: 20
                            }, {
                                type: "static_text",
                                name: dialogBoxes.numberingPages.yMargins[global.gLang]
                            }]
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "popup",
                                item_id: "algn",
                                width: 50,
                                height: 20
                            }, {
                                type: "static_text",
                                name: dialogBoxes.numberingPages.align[global.gLang],
                            }]
                        }]
                    }]
                }, {
                    type: "cluster",
                    name: dialogBoxes.numberingPages.borderSet[global.gLang],
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: dialogBoxes.numberingPages.size[global.gLang]
                    }, {
                        type: "popup",
                        item_id: "thck",
                        width: 50,
                        height: 20
                    }, {
                        type: "static_text",
                        name: dialogBoxes.numberingPages.style[global.gLang]
                    }, {
                        type: "popup",
                        item_id: "brdr",
                        width: 50,
                        height: 20
                    }, {
                        type: "static_text",
                        name: dialogBoxes.numberingPages.width[global.gLang]
                    }, {
                        type: "edit_text",
                        item_id: "fldw",
                        width: 50,
                        height: 20
                    }, {
                        type: "static_text",
                        name: dialogBoxes.numberingPages.height[global.gLang]
                    }, {
                        type: "edit_text",
                        item_id: "fldh",
                        width: 50,
                        height: 20
                    }]
                }, {
                    type: "cluster",
                    name: dialogBoxes.numberingPages.numberTools[global.gLang],
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: dialogBoxes.numberingPages.firstNum[global.gLang]
                    }, {
                        type: "edit_text",
                        item_id: "frsp",
                        alignment: "align_right",
                        width: 50,
                        height: 20
                    }, {
                        type: "view",
                        align_children: "align_row",
                        elements: [{
                            type: "check_box",
                            name: dialogBoxes.numberingPages.restartNumIf[global.gLang],
                            item_id: "rstr"
                        }, {
                            type: "edit_text",
                            item_id: "rstf",
                            width: 50,
                            height: 20
                        }]
                    }]
                }, {
                    type: "view",
                    align_children: "align_row",
                    elements: [{
                        type: "cluster",
                        name: dialogBoxes.numberingPages.numberingRange[global.gLang],
                        elements: [{
                            type: "check_box",
                            name: dialogBoxes.numberingPages.activate[global.gLang],
                            item_id: "rngs"
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "radio",
                                name: dialogBoxes.numberingPages.from[global.gLang],
                                group_id: "rdrs",
                                item_id: "rd10"
                            }, {
                                type: "edit_text",
                                item_id: "fr01",
                                width: 50,
                                height: 20
                            }, {
                                type: "static_text",
                                name: " " + dialogBoxes.numberingPages.to[global.gLang] + " "
                            }, {
                                type: "edit_text",
                                item_id: "to01",
                                width: 50,
                                height: 20
                            }]
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "radio",
                                name: dialogBoxes.numberingPages.from[global.gLang],
                                group_id: "rdrs",
                                item_id: "rd20"
                            }, {
                                type: "edit_text",
                                item_id: "fr02",
                                width: 50,
                                height: 20
                            }, {
                                type: "static_text",
                                name: " " + dialogBoxes.numberingPages.toLastPage[global.gLang]
                            }]
                        }]
                    }, {
                        type: "cluster",
                        name: dialogBoxes.numberingPages.fineTune[global.gLang],
                        elements: [{
                            type: "check_box",
                            name: dialogBoxes.numberingPages.incrementSet[global.gLang],
                            item_id: "rngn"
                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "edit_text",
                                width: 50,
                                height: 20,
                                item_id: "chk1"
                            }, {
                                type: "static_text",
                                height: (global.gLang == "ENG") ? 20 : 35,
                                name: dialogBoxes.numberingPages.pageIncrement[global.gLang]
                            }]

                        }, {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                type: "edit_text",
                                width: 50,
                                height: 20,
                                item_id: "chk2"
                            }, {
                                type: "static_text",
                                height: (global.gLang == "ENG") ? 20 : 35,
                                name: dialogBoxes.numberingPages.numIncrement[global.gLang]
                            }]
                        }]
                    }]
                }, {
                    type: "cluster",
                    name: dialogBoxes.numberingPages.insertText[global.gLang],
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: dialogBoxes.numberingPages.before[global.gLang]
                    }, {
                        type: "edit_text",
                        item_id: "txtb",
                        width: 100,
                        height: 20
                    }, {
                        type: "static_text",
                        name: dialogBoxes.numberingPages.after[global.gLang]
                    }, {
                        type: "edit_text",
                        item_id: "txta",
                        width: 100,
                        height: 20
                    }, {
                        type: "check_box",
                        item_id: "ttaa",
                        name: dialogBoxes.numberingPages.totalPageNum[global.gLang]
                    }]
                },
                {
                    type: "view",
                    align_children: "align_row",
                    elements: [{
                        type: "view",
                        align_children: "align_left",
                        elements: [{
                            type: "static_text",
                            name: menuSections.sign.short,
                            font: "palette"
                        }]
                    }, {
                        type: "gap",
                        width: (global.gLang == "ENG") ? 150 : 235
                    }, {
                        type: "ok_cancel_other",
                        ok_name: dialogBoxes.buttons.start[global.gLang],
                        cansel_name: "Exit",
                        other_name: dialogBoxes.buttons.clear[global.gLang]
                    }]
                }
                ]
            }]
        }
    };


    var initdialogNum = app.execDialog(dialogNum);

    function POLICEaddNumbering() {
        var stepForNextPage = 1;
        var stepForNextNumber = 1;
        var numberPage = Number(dialogNum.check.firstPageNumber);
        var textBefore = String(dialogNum.check.textBefore);
        var textAfter = String(dialogNum.check.textAfter);
        var textBonus = dialogNum.check.textBonus ? String(this.numPages) : "";
        var startPage = 0;
        if (dialogNum.check.additionalActivate) {
            stepForNextPage = Number(dialogNum.check.pageStep);
            stepForNextNumber = Number(dialogNum.check.numberStep);
        }
        var pageForRestart = dialogNum.check.restartNumActivate ? (Number(dialogNum.check.restartNumValue) + 1) : 0;
        var finishPage = this.numPages;
        if (dialogNum.check.rangeActivate) {
            if (dialogNum.check.oneRange) {
                startPage = Number(dialogNum.check.rangeStartPage) - 1;
                finishPage = Number(dialogNum.check.rangeEndPage);
            } else {
                startPage = Number(dialogNum.check.rangeOnlyStartPage) - 1;
            }
        }
        var textSize = dialogNum.check.fontSize;
        var alignment = "right";
        switch (dialogNum.check.txtAlign) {
            case "Right":
                alignment = "right";
                break;
            case "Center":
                alignment = "center";
                break;
            case "Left":
                alignment = "left";
                break;
        }
        var mmToDots = 2.835; // one inch has 72 dots and one inch is 25,4 mm (72/25,4 = 2.835 dots for one mm)
        var progressBar = app.thermometer;
        var fileName = this.documentFileName.replace(/\.pdf$/i, "");
        progressBar.begin();
        progressBar.duration = finishPage;
        for (startPage; startPage < finishPage; startPage += stepForNextPage) {
            var aRect = this.getPageBox("Crop", startPage);
            var heightPage = aRect[1] - aRect[3];
            var widthPage = aRect[2] - aRect[0];
            var heightField = Number(dialogNum.check.fieldHeight) * mmToDots;
            var widthField = Number(dialogNum.check.fieldWidth) * mmToDots;
            var verticalMargin = Number(dialogNum.check.vMargin) * mmToDots;
            var horizontalMargin = Number(dialogNum.check.hMargin) * mmToDots;
            var percent = (startPage + 1) / finishPage * 100;
            progressBar.value = startPage;
            progressBar.text = "File \"" + fileName + "\" in progress\nNumbering  page " + (startPage + 1) + " of " + finishPage + " (" + percent.toFixed() + " %)";
            if (progressBar.cancelled)
                break;
            var fieldForNumber;

            //position setteings
            if (dialogNum.check.positionBottom) {
                if (dialogNum.check.positionLeft) { //for bottom_left insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [horizontalMargin, verticalMargin, (widthField + horizontalMargin), (heightField + verticalMargin)]);
                } else if (dialogNum.check.positionCenter) { //for bottom_center insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [(widthPage / 2 - widthField / 2), verticalMargin, (widthPage / 2 + widthField / 2), (heightField + verticalMargin)]);
                } else { //for bottom_right insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [(widthPage - widthField - horizontalMargin), (heightField + verticalMargin), (widthPage - horizontalMargin), verticalMargin]);
                }
            } else {
                if (dialogNum.check.positionLeft) { //for top_left insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [horizontalMargin, heightPage - verticalMargin, (widthField + horizontalMargin), (heightPage - heightField - verticalMargin)]);
                } else if (dialogNum.check.positionCenter) { //for top_center insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [(widthPage / 2 - widthField / 2), (heightPage - verticalMargin), (widthPage / 2 + widthField / 2), (heightPage - heightField - verticalMargin)]);
                } else { //for top_right insert
                    fieldForNumber = this.addField(String("page__number__" + (startPage + 1)), "text", startPage, [(widthPage - horizontalMargin), (heightPage - verticalMargin), (widthPage - widthField - horizontalMargin), (heightPage - heightField - verticalMargin)]);
                }
            }
            console.println((widthPage - widthField - horizontalMargin) + " (" + typeof heightField + "x" + typeof verticalMargin + ") " + (heightField + verticalMargin) + " " + (widthPage - horizontalMargin) + " " + verticalMargin);
            fieldForNumber.value = textBefore + numberPage + textAfter + textBonus;
            numberPage += stepForNextNumber;

            if (dialogNum.check.lineWidth != "None") {
                fieldForNumber.strokeColor = color.black;
                switch (dialogNum.check.borderStyle) {
                    case "Solid":
                        fieldForNumber.borderStyle = border.s;
                        break;
                    case "Beveled":
                        fieldForNumber.borderStyle = border.b;
                        break;
                    case "Dashed":
                        fieldForNumber.borderStyle = border.d;
                        break;
                    case "Inset":
                        fieldForNumber.borderStyle = border.i;
                        break;
                    case "Underline":
                        fieldForNumber.borderStyle = border.u;
                        break;
                }
                switch (dialogNum.check.lineWidth) {
                    case "Medium":
                        fieldForNumber.lineWidth = 2;
                        break;
                    case "Thin":
                        fieldForNumber.lineWidth = 1;
                        break;
                    case "Thick":
                        fieldForNumber.lineWidth = 3;
                        break;
                }
            } else {
                fieldForNumber.lineWidth = 0;
            }
            //fieldForNumber.borderStyle = border.u;
            /* 
            Solid border.s 
            Beveled border.b 
            Dashed border.d 
            Inset border.i 
            Underline border.u 
            */
            //fieldForNumber.strokeColor = color.black;
            /* 
            Red color.red               [ "RGB", 1,0,0 ]
            Green color.green           [ "RGB", 0,1,0 ]
            Blue color.blue             [ "RGB", 0, 0, 1 ]
            Cyan color.cyan             [ "CMYK", 1,0,0,0 ]
            Magenta color.magenta       [ "CMYK", 0,1 0,0 ]
            Yellow color.yellow         [ "CMYK", 0,0,1,0 ]
            Dark Gray color.dkGray      [ "G", 0.25 ] 4.0
            Gray color.gray             [ "G", 0.5 ] 4.0
            Light Gray color.ltGray     [ "G", 0.75 ] 4.0
            */
            //fieldForNumber.lineWidth = 1;
            /* 
            0 — None
            1 — Thin
            2 — Medium
            3 — Thick
            */
            fieldForNumber.textSize = textSize;
            fieldForNumber.readonly = true;
            fieldForNumber.alignment = alignment;
            fieldForNumber.textFont = dialogNum.check.fontName;
            if (numberPage == pageForRestart)
                numberPage = 1;
        }
        progressBar.text = "Ready";
        progressBar.end();
        // app.alert({
        //     cMsg: "Completed: number of last page " + (numberPage - 1) + ".\nUse this for the next document",
        //     cTitle: "  Conclusion",
        //     nIcon: 3
        // });
    }
    if ("ok" == String(initdialogNum)) {
        POLICEaddNumbering();
    }
    /*     if ("other" == String(initdialogNum)) {
            POLICErevomeNumbering();
        } */
    app.endPriv();
});

//adding numeration to document
/* var POLICEaddNumbering = app.trustedFunction(function() {
    app.beginPriv();
    var numberPage = 1;
    var textSize = 10;
    var alignment = "right";
    var mmToDots = 2.835; // one inch 72 dots (72/25,4 = 2.835 - one mm 2,835 dots)
    var oThermometer = app.thermometer;
    var fileName = this.documentFileName.replace(/\.pdf$/i, "");
    oThermometer.begin();
    oThermometer.duration = this.numPages;
    for (var page = 0; page < this.numPages; page++) {
        var aRect = this.getPageBox("Crop", page);
        var heightPage = aRect[1] - aRect[3];
        var widthPage = aRect[2] - aRect[0];
        var heightField = 7 * mmToDots;
        var widthField = 50 * mmToDots;
        var margins = 5 * mmToDots;
        var percent = (page + 1) / this.numPages * 100;
        oThermometer.value = page;
        oThermometer.text = "File \"" + fileName + "\" in progress\nNumbering  page " + (page + 1) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
        if (oThermometer.cancelled)
            break;
        if ((page + 1) % 2 == 0) //odd/even page detection
            continue;
        var fieldForNumber = this.addField(String("page__number__" + (page + 1)), "text", page, [widthPage - margins, heightPage - margins, (widthPage - widthField - margins), (heightPage - heightField - margins)]);
        fieldForNumber.value = numberPage++;
        fieldForNumber.textSize = textSize;
        fieldForNumber.readonly = true;
        fieldForNumber.alignment = alignment;
        if (numberPage == 251)
            numberPage = 1;
    }
    oThermometer.text = "Ready";
    oThermometer.end();
    app.alert({
        cMsg: "Completed: number of last page " + (numberPage - 1) + ".\nUse this for the next document",
        cTitle: "  Conclusion",
        nIcon: 3
    });
    app.endPriv();
}); */
/*
fieldForNumber.strokeColor = color.black;
*/
//remove numbering from document
var POLICErevomeNumbering = app.trustedFunction(function () {
    app.beginPriv();
    var oThermometer = app.thermometer;
    oThermometer.begin();
    oThermometer.duration = this.numPages;
    var fileName = this.documentFileName.replace(/\.pdf$/i, "");
    for (var page = 0; page < this.numPages; page++) {
        var percent = (page + 1) / this.numPages * 100;
        oThermometer.value = page;
        oThermometer.text = "File \"" + fileName + "\" in progress\nRemove numbering from page " + (page + 1) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
        if (oThermometer.cancelled)
            break;
        this.removeField(String("page__number__" + (page + 1)));
    }
    oThermometer.text = "Ready"
    oThermometer.end();
    app.endPriv();
});

//============================================RATATE PAGES============================================

showRotateDialog = app.trustedFunction(function () {
    app.beginPriv();
    var rotateDialog = {
        check: {},
        initialize: function (dialog) {
            dialog.load({ "rd06": true });
        },
        commit: function (dialog) {
            var sourse = dialog.store();
            for (var i = 1; i < 7; i++) {
                if (sourse["rd0" + i])
                    this.check["rd0" + i] = sourse["rd0" + i];
            }
        },
        cancel: function (dialog) {
            dialog.end("cancel");
        },
        description: {
            name: menuSections.rotatePages[global.gLang],
            align_children: "align_left",
            elements: [{
                type: "view",
                width: 205,
                elements: [{
                    type: "cluster",
                    name: dialogBoxes.rotatePages.explanation[global.gLang],
                    elements: [{
                        type: "static_text",
                        name: dialogBoxes.rotatePages.clockwise[global.gLang],
                    }, {
                        type: "static_text",
                        name: dialogBoxes.rotatePages.counterclockwise[global.gLang],
                    },]
                }, {
                    type: "cluster",
                    name: dialogBoxes.rotatePages.tallDescription[global.gLang],
                    align_children: "align_left",
                    elements: [{
                        type: "radio",
                        item_id: "rd01",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.upToRight[global.gLang],
                    },
                    {
                        type: "radio",
                        item_id: "rd02",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.upToLeft[global.gLang],
                    }
                    ]
                }, {
                    type: "cluster",
                    name: dialogBoxes.rotatePages.wideDescription[global.gLang],
                    align_children: "align_left",
                    elements: [{
                        type: "radio",
                        item_id: "rd03",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.upToRight[global.gLang],
                    },
                    {
                        type: "radio",
                        item_id: "rd04",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.upToLeft[global.gLang],
                    }
                    ]
                },
                {
                    type: "cluster",
                    name: dialogBoxes.rotatePages.extra[global.gLang],
                    align_children: "align_left",
                    elements: [{
                        type: "radio",
                        item_id: "rd05",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.return[global.gLang],
                    },
                    {
                        type: "radio",
                        item_id: "rd06",
                        group_id: "rado",
                        name: dialogBoxes.rotatePages.turn[global.gLang],
                    }
                    ]
                }, {
                    type: "view",
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: menuSections.sign.short,
                        font: "palette"
                    }, {
                        type: "ok_cancel",
                        ok_name: dialogBoxes.buttons.start[global.gLang],
                        cancel_name: dialogBoxes.buttons.cancel[global.gLang],
                    }]
                }
                ]
            },]
        }
    };


    var rotateDialogInit = app.execDialog(rotateDialog);

    if ("ok" == String(rotateDialogInit)) {

        var progressBar = app.thermometer; //прогресс-бар
        var cntRotate = 0;
        var repRotate = rotateDialog.check.rd05 ? " " + infoBoxes.successRotate.return[global.gLang] : " " + infoBoxes.successRotate.turn[global.gLang];
        progressBar.begin();
        progressBar.duration = this.numPages;
        for (var countPage = 0; countPage < this.numPages; countPage++) {
            console.println(rotateDialog.check.rd);
            progressBar.value = countPage;
            var percent = ((countPage + 1) / this.numPages) * 100;
            progressBar.text = "PAGE ROTATION\nProcessing page " + (countPage + 1) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
            if (progressBar.cancelled) break;
            var Rect = this.getPageBox("Crop", countPage);
            var width = (Rect[2] - Rect[0]);
            var height = (Rect[1] - Rect[3]);
            if (width < height && rotateDialog.check.rd01) {
                this.setPageRotations(countPage, countPage, 90);
                cntRotate++;
            } else if (width < height && rotateDialog.check.rd02) {
                this.setPageRotations(countPage, countPage, 270);
                cntRotate++;
            } else if (width > height && rotateDialog.check.rd03) {
                this.setPageRotations(countPage, countPage, 90);
                cntRotate++;
            } else if (width > height && rotateDialog.check.rd04) {
                this.setPageRotations(countPage, countPage, 270);
                cntRotate++;
            } else if (rotateDialog.check.rd05) {
                this.setPageRotations(countPage, countPage, 0);
                cntRotate++;
            } else if (rotateDialog.check.rd06) {
                this.setPageRotations(countPage, countPage, 180);
                cntRotate++
            }
        }
        progressBar.text = "Ready";
        progressBar.end();
        Alerter("successRotate", infoBoxes.icon.status, cntRotate + repRotate);
    }
    app.endPriv();
});

//============================================FORMAT DETECTION============================================TESTING

//GLOBAL VARIABLES

var mBlue = ["RGB", 0, 0.7, 0.93];
var mOrange = ["RGB", 1, .27,];

var isoInfo = { // inaccuracy +30 mm 
    "A4": { // long edge length
        "lngE": 297, "shrtE": 210, "used": 327, "id": "0"
    },
    "A3": {
        "lngE": 420, "shrtE": 297, "used": 450, "id": "1"
    },
    "A2": {
        "lngE": 594, "shrtE": 420, "used": 624, "id": "2"
    },
    "A1": {
        "lngE": 841, "shrtE": 594, "used": 871, "id": "3"
    },
    "A0": {
        "lngE": 1189, "shrtE": 841, "used": 1219, "id": "4"
    },
    "unknow": {
        "id": "999"
    },
    "ratio": {
        "isoMin": 0.707, // iso ratio size ~0.71 (short/long)
        "isoMax": 1.41, // iso ratio size ~1.41 (long/short)
        "useMin": 0.71, // used ratio size ~0.71 + inaccuracy
        "useMax": 1.5, // used ratio size ~1.41 + inaccuracy
        "square": 1.2  //square ratio size ~1 + inaccuracy
    }
}

testShowRanges = app.trustedFunction(function (dialogStore) {
    app.beginPriv();

    ///____________________________________________ANCILLARY FUNCTIONS____________________________________________  

    function nameDefine(w, h, calcStore) {
        var curRat = (w > h) ? w / h : h / w;
        var le = Math.max(w, h); // long edge length
        var res = { "nameSize": "", "idSize": "", "trueSize": "" };
        if (calcStore.uIso || (curRat >= isoInfo.ratio.square && curRat <= isoInfo.ratio.useMax)) {
            if (le <= isoInfo.A4.used) {
                res = {
                    "nameSize": "A4",
                    "idSize": isoInfo.A4.id,
                    "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                };
            } else if (le <= isoInfo.A3.used) {
                res = (calcStore.a34 || calcStore.a234)
                    ? {
                        "nameSize": "A4",
                        "idSize": isoInfo.A4.id,
                        "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                    }
                    : {
                        "nameSize": "A3",
                        "idSize": isoInfo.A3.id,
                        "trueSize": isoInfo.A3.shrtE + "x" + isoInfo.A3.lngE
                    };
            } else if (le <= isoInfo.A2.used) {
                res = (calcStore.a234)
                    ? {
                        "nameSize": "A4",
                        "idSize": isoInfo.A4.id,
                        "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                    }
                    : {
                        "nameSize": "A2",
                        "idSize": isoInfo.A2.id,
                        "trueSize": isoInfo.A2.shrtE + "x" + isoInfo.A2.lngE
                    }
            } else if (le <= isoInfo.A1.used) {
                res = {
                    "nameSize": "A1",
                    "idSize": isoInfo.A1.id,
                    "trueSize": isoInfo.A1.shrtE + "x" + isoInfo.A1.lngE
                };
            } else if (le <= isoInfo.A0.used) {
                res = {
                    "nameSize": "A0",
                    "idSize": isoInfo.A0.id,
                    "trueSize": isoInfo.A0.shrtE + "x" + isoInfo.A0.lngE
                };
            } else {
                res = calcStore.u4
                    ? {
                        "nameSize": "A4",
                        "idSize": isoInfo.A4.id,
                        "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                    }
                    : {
                        "nameSize": "Unknow",
                        "idSize": isoInfo.unknow.id,
                        "trueSize": "-"
                    };
            }
        } else if (curRat < isoInfo.ratio.square) {
            res = calcStore.u4
                ? {
                    "nameSize": "A4",
                    "idSize": isoInfo.A4.id,
                    "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                }
                : {
                    "nameSize": "Unknow",
                    "idSize": isoInfo.unknow.id,
                    "trueSize": "-"
                };
        } else {
            var se = Math.min(w, h); // short edge length
            var suffix = Math.round(le / (isoInfo.ratio.isoMin * se));
            if (se <= isoInfo.A4.used) {
                res = {
                    "nameSize": "A4x" + suffix,
                    "idSize": isoInfo.A4.id + "5" + suffix,
                    "trueSize": isoInfo.A4.lngE + "x" + (isoInfo.A4.shrtE * suffix)
                };
            } else if (se <= isoInfo.A3.used) {
                res = {
                    "nameSize": "A3x" + suffix,
                    "idSize": isoInfo.A3.id + "6" + suffix,
                    "trueSize": isoInfo.A3.lngE + "x" + (isoInfo.A3.shrtE * suffix)
                };
            } else if (se <= isoInfo.A2.used) {
                res = {
                    "nameSize": "A2x" + suffix,
                    "idSize": isoInfo.A2.id + "7" + suffix,
                    "trueSize": isoInfo.A2.lngE + "x" + (isoInfo.A2.shrtE * suffix)
                };
            } else if (se <= isoInfo.A1.used) {
                res = {
                    "nameSize": "A1x" + suffix,
                    "idSize": isoInfo.A1.id + "8" + suffix,
                    "trueSize": isoInfo.A1.lngE + "x" + (isoInfo.A1.shrtE * suffix)
                };
            } else {
                res = calcStore.u4
                    ? {
                        "nameSize": "A4",
                        "idSize": isoInfo.A4.id,
                        "trueSize": isoInfo.A4.shrtE + "x" + isoInfo.A4.lngE
                    }
                    : {
                        "nameSize": "Unknow",
                        "idSize": isoInfo.unknow.id,
                        "trueSize": "-"
                    };
            }
        }

        return res;
    }

    function sizeDefine(num, calcStore) {
        var dpm = 2.834; // dots per millimeter
        var rct = this.getPageBox("Crop", num);
        var wdt = Math.round((rct[2] - rct[0]) / dpm);
        var hgt = Math.round((rct[1] - rct[3]) / dpm);
        var res = nameDefine(wdt, hgt, calcStore);
        res.wdt = wdt;
        res.hgt = hgt;
        return res;
    }

    function findIndex(container, item) {
        for (var i = 0; i < container.length; ++i) {
            if (container[i].nameSize == item) {
                return i;
            }
        }
        return -1;
    }

    function pageAnalyzer(calcStore) {
        var res = new Array();
        var progressBar = app.thermometer;
        progressBar.duration = this.numPages;
        progressBar.begin();
        for (var i = 0; i < this.numPages; ++i) {
            var percent = ((i + 1) / this.numPages) * 100;
            progressBar.text = "FORMAT DETECTION\nProcessing page " + (i + 1) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
            if (progressBar.cancelled) break;
            var pageInfo = sizeDefine(i, calcStore);
            var index = findIndex(res, pageInfo.nameSize);
            if (index == -1) {
                res.push({
                    "nameSize": pageInfo.nameSize,
                    "idSize": pageInfo.idSize,
                    "trueSize": pageInfo.trueSize,
                    "pages": [{ "num": i + 1, "wdt": pageInfo.wdt, "hgt": pageInfo.hgt }]
                });
            } else {
                res[index].pages.push({ "num": i + 1, "wdt": pageInfo.wdt, "hgt": pageInfo.hgt });
            }
        }
        progressBar.text = "Acrobat DC";
        progressBar.end();
        return res;
    }

    function addZero(i) {
        return i < 10 ? i = "0" + i : i;
    }

    function checkNums(prevNum, curNum, delim) {
        var res = "";
        if (!prevNum) {
            res = curNum;
        } else if (curNum - prevNum == 1) {
            if (delim != "-") {
                res = "-";
            }
        } else {
            res = (delim == "-") ? prevNum + "," + curNum : res += "," + curNum;
        }
        return res;
    }

    function splitForRange(pages, split) {
        var tmp = {
            "all": 0, "lnd": 0, "prt": 0
        }

        var res = {
            "rng": "",
            "lnd": { "rng": "", "cnt": 0 },
            "prt": { "rng": "", "cnt": 0 }
        }

        for (var i = 0; i < pages.length; ++i) {
            res.rng += checkNums(tmp.all, pages[i].num, tmp.all ? res.rng[res.rng.length - 1] : ".");
            tmp.all = pages[i].num;
            if (split) {
                if (pages[i].wdt > pages[i].hgt) {
                    res.lnd.rng += checkNums(tmp.lnd, pages[i].num, tmp.lnd ? res.lnd.rng[res.lnd.rng.length - 1] : ".");
                    ++res.lnd.cnt;
                    tmp.lnd = pages[i].num;
                } else {
                    res.prt.rng += checkNums(tmp.prt, pages[i].num, tmp.prt ? res.prt.rng[res.prt.rng.length - 1] : ".");
                    ++res.prt.cnt;
                    tmp.prt = pages[i].num;
                }
            }
            if ((i + 1) == pages.length) {
                if (res.rng[res.rng.length - 1] == "-") {
                    res.rng += tmp.all;
                }
                if (res.lnd.rng[res.lnd.rng.length - 1] == "-") {
                    res.lnd.rng += tmp.lnd;
                }
                if (res.prt.rng[res.prt.rng.length - 1] == "-") {
                    res.prt.rng += tmp.prt;
                }

            }
        }
        return res;
    }

    ///____________________________________________GENERAL____________________________________________  

    var calcStore = {
        "split": dialogStore.split, // landscape and portrait pages in different range
        "verbose": dialogStore.verbose, // report fo each page  
        "a34": dialogStore.a34, // A3 as A4
        "a234": dialogStore.a234, // A2, A3 as A4
        "u4": dialogStore.u4, // unknow as A4
        "uIso": dialogStore.uIso, // unknow as ISO      
    }

    var fDate = new Date();
    var start = {
        "value": fDate.getTime(),
        "hours": addZero(fDate.getHours()),
        "minutes": addZero(fDate.getMinutes()),
        "seconds": addZero(fDate.getSeconds()),
        "day": addZero(fDate.getDay()),
        "month": addZero(fDate.getMonth()),
        "year": addZero(fDate.getFullYear())
    }

    var rep = new Report();
    var sizeStore = pageAnalyzer(calcStore);
    var trueAnalizesPages = 0;

    rep.style = "DefaultNoteText";

    // sorting by format's size
    sizeStore.sort((lhs, rhs) => (lhs.idSize - rhs.idSize > 0));

    rep.color = mBlue;
    rep.writeText("\n\n" + infoBoxes.report.totalNumPage[global.gLang] + ": " + this.numPages);
    rep.divide(1);
    rep.writeText(" ");
    rep.color = color.black;

    for (var i = 0; i < sizeStore.length; ++i) {
        trueAnalizesPages += sizeStore[i].pages.length;
        rep.writeText(sizeStore[i].nameSize + (sizeStore[i].nameSize.length > 5 ? "\t" : "\t\t") + sizeStore[i].pages.length);
    }

    rep.writeText(" ");
    rep.divide(1);
    rep.color = mBlue;
    rep.writeText(infoBoxes.report.analized[global.gLang] + " " + trueAnalizesPages + " " + infoBoxes.report.from[global.gLang] + " " + this.numPages + " (" + (trueAnalizesPages / this.numPages * 100).toFixed() + "%)");

    //exec time calculating
    var sDate = new Date();
    var end = sDate.getTime();
    var minDiff = (end / 1000 - start.value / 1000) / 60;
    if (minDiff < 1) minDiff = 0;
    var secDiff = (end / 1000 - start.value / 1000) % 60;

    rep.color = mBlue;
    rep.writeText(infoBoxes.report.startTime[global.gLang] + " " + start.hours + ":" + start.minutes + ":" + start.seconds + " " + start.day + "." + start.month + "." + start.year);
    rep.writeText(infoBoxes.report.execTime[global.gLang] + " " + minDiff.toFixed(0) + " " + infoBoxes.date.min[global.gLang] + " , " + secDiff.toFixed(1) + " " + infoBoxes.date.sec[global.gLang])
    rep.color = color.red;
    rep.divide(1)

    var unknowIndex = -1;

    // fill the report 
    for (var i = 0; i < sizeStore.length; ++i) {
        unknowIndex = (sizeStore[i].nameSize == "Unknow") ? i : -1;
        var result = splitForRange(sizeStore[i].pages, calcStore.split);
        rep.color = color.blue;
        rep.writeText(infoBoxes.report.pagesAt[global.gLang]
            + " "
            + sizeStore[i].nameSize
            + (sizeStore[i].nameSize.length > 3 ? "\t\t[ " : "\t\t\t[ ")
            + sizeStore[i].trueSize
            + " mm , "
            + infoBoxes.report.total[global.gLang]
            + " "
            + sizeStore[i].pages.length
            + " ]");
        rep.color = color.black;
        rep.writeText("\n" + result.rng + "\n");
        if (calcStore.split) {
            rep.color = color.gray;
            if (result.lnd.cnt && result.prt.cnt) {
                rep.writeText(sizeStore[i].nameSize
                    + "   \u2585  "
                    + infoBoxes.report.land[global.gLang] + ": " + result.lnd.cnt);
                rep.writeText("\n" + result.lnd.rng);
                rep.writeText("\n" + sizeStore[i].nameSize
                    + "   \u258B  "
                    + infoBoxes.report.port[global.gLang] + ": " + result.prt.cnt);
                rep.writeText("\n" + result.prt.rng + "\n");
            }
        }
        rep.divide(1);
    }

    // add the unknow pages info to the report
    if (unknowIndex != -1) {
        rep.writeText("\n" + infoBoxes.report.uTitle[global.gLang] + ":\n");
        for (var i = 0; i < sizeStore[unknowIndex].pages.length; ++i) {
            rep.writeText((i + 1) + ") [ " + sizeStore[unknowIndex].pages[i].wdt + "x" + sizeStore[unknowIndex].pages[i].hgt + " ]");
        }
        rep.writeText(" ");
        rep.divide(1);
    }

    // add page's sizes verbose description to the report
    if (calcStore.verbose) {
        var insertion = "";
        rep.color = color.blue;
        rep.writeText("\n\t\t\t\t\t" + infoBoxes.report.fullReport[global.gLang] + "\n");
        rep.divide(1);
        rep.writeText("\n");
        rep.color = color.gray;
        var progressBar = app.thermometer;
        progressBar.duration = this.numPages;
        progressBar.begin();
        var count = 1;
        for (var i = 0; i < sizeStore.length; ++i) {
            if (sizeStore[i].nameSize != "Unknow") {
                insertion += sizeStore[i].nameSize + "\t\t\t\t_____" + infoBoxes.report.quantity[global.gLang] + ": " + sizeStore[i].pages.length + " (" + (sizeStore[i].pages.length / this.numPages * 100).toFixed(1) + "% " + infoBoxes.report.ofAll[global.gLang] + ")_____\n\n"
                for (var j = 0; j < sizeStore[i].pages.length; ++j) {
                    var percent = (count / this.numPages) * 100;
                    progressBar.text = "PREPARATION OF A DETAILED REPORT\nProcessing page " + (count++) + " of " + this.numPages + " (" + percent.toFixed() + " %)";
                    if (progressBar.cancelled) break;
                    insertion += sizeStore[i].pages[j].num + "\t[ " + sizeStore[i].pages[j].wdt + "x" + sizeStore[i].pages[j].hgt + " ]\t";
                }
                insertion += "\n\n";
            }
        }
        rep.writeText(insertion);
        rep.writeText("\n");
        rep.divide(1);
        progressBar.text = "Acrobat DC";
        progressBar.end();
    }

    rep.color = mOrange;
    rep.writeText(infoBoxes.report.quote);

    // open the report
    var newRepDoc = rep.open(infoBoxes.report.tabName[global.gLang] + " \"" + this.documentFileName + "\"");
    newRepDoc.zoomType = zoomtype.fitP;
    newRepDoc.info.Title = infoBoxes.report.title[global.gLang] + " " + this.documentFileName;
    newRepDoc.info.Producer = menuSections.sign.mail;

    // add title to report
    var docName = this.documentFileName.length < 65 ? this.documentFileName :
        this.documentFileName.substring(0, 25) + ".../..." + this.documentFileName.substring(this.documentFileName.length - 25);
    newRepDoc.addWatermarkFromText({
        nStart: 0,
        nEnd: 0,
        cText: infoBoxes.report.title[global.gLang] + "\r\"" + docName + "\"",
        nTextAlign: app.constants.align.right,
        nHorizAlign: app.constants.align.right,
        nVertAlign: app.constants.align.top,
        nHorizValue: -34, nVertValue: -12,
        aColor: color.red,
        nFontSize: 15,
    });

    //add numbering to report
    //box-size coordinates [xTopLeft: 0, yTopLeft: 792, xRightBottmom: 612, yRightBottmom: 0]
    for (var i = 0; i < newRepDoc.numPages; ++i) {
        var fld = newRepDoc.addField("fld_" + i, "text", i, [34, 35, 205, 7]);
        fld.value = infoBoxes.report.page[global.gLang] + " #" + (i + 1) + " " + infoBoxes.report.from[global.gLang] + " " + newRepDoc.numPages;
        fld.textColor = mBlue;
        fld.readonly = true;
        fld.alignment = "left";
        fld.textFont = font.HelvI;
        fld.textSize = 13;
    }

    //add a signature to report
    var sign = newRepDoc.addField("qSign", "text", 0, [515, 35, 578, 7]);
    sign.value = menuSections.sign.short;
    sign.textColor = color.gray;
    sign.readonly = true;
    sign.alignment = "right";
    sign.textFont = font.HelvI;
    sign.textSize = 13;

    app.endPriv();
});

strartTest = app.trustedFunction(function () {
    app.beginPriv()

    // A dialog box description
    var formatDetectionDialog = {
        check: {},
        initialize: function (dialog) {
            this.auxTgl = false;
            this.unknProcTgl = false;
            dialog.load({ "mrge": true, "noa3": true, "verb": false, "auxi": false, "chun": false, "unis": true });
            dialog.enable({ "noa3": this.auxTgl, "no34": this.auxTgl, "unis": this.unknProcTgl, "una4": this.unknProcTgl });
        },
        commit: function (dialog) {
            var sourse = dialog.store();
            this.check.split = sourse["splt"]; // split landscape and portrait ranges
            this.check.verbose = sourse["verb"]; // verbose
            this.check.a34 = sourse["noa3"] && sourse["auxi"]; // A3 as A4 && auxiliary
            this.check.a234 = sourse["no34"] && sourse["auxi"]; // A3/A2 as A4 && auxiliary
            this.check.uIso = sourse["unis"] && sourse["unkn"]; // unknow as IOS && unknow processing
            this.check.u4 = sourse["una4"] && sourse["unkn"]; // unknow as A4 && unknow processing
        },
        cancel: function (dialog) {
            dialog.end("cancel");
        },
        auxi: function (dialog) {
            this.auxTgl = !this.auxTgl;
            dialog.enable({ "noa3": this.auxTgl, "no34": this.auxTgl });
        },
        unkn: function (dialog) {
            this.unknProcTgl = !this.unknProcTgl;
            dialog.enable({ "unis": this.unknProcTgl, "una4": this.unknProcTgl });
        },
        description: {
            name: dialogBoxes.formatDetection.title[global.gLang],
            align_children: "align_left",
            elements: [{
                type: "view",
                elements: [{
                    type: "cluster",
                    name: dialogBoxes.formatDetection.repOptions[global.gLang],
                    elements: [{
                        type: "radio",
                        item_id: "mrge",
                        group_id: "rado",
                        height: (global.gLang == "ENG") ? 20 : 35,
                        name: dialogBoxes.formatDetection.mergeLP[global.gLang]
                    },
                    {
                        type: "radio",
                        item_id: "splt",
                        group_id: "rado",
                        height: (global.gLang == "ENG") ? 20 : 35,
                        name: dialogBoxes.formatDetection.splitLP[global.gLang]
                    }
                    ]
                }, {
                    type: "cluster",
                    name: dialogBoxes.formatDetection.additional[global.gLang],
                    elements: [
                        {
                            type: "check_box",
                            alignment: "align_left",
                            item_id: "verb",
                            name: dialogBoxes.formatDetection.verbose[global.gLang],
                            value: false
                        }, {
                            type: "cluster",
                            align_children: "align_left",
                            elements: [
                                {
                                    type: "check_box",
                                    alignment: "align_left",
                                    item_id: "unkn",
                                    name: dialogBoxes.formatDetection.unknProcTitle[global.gLang]
                                }, {
                                    type: "radio",
                                    alignment: "align_left",
                                    item_id: "unis",
                                    group_id: "radu",
                                    name: dialogBoxes.formatDetection.unknToISO[global.gLang]
                                }, {
                                    type: "radio",
                                    alignment: "align_left",
                                    item_id: "una4",
                                    group_id: "radu",
                                    name: dialogBoxes.formatDetection.unknToA4[global.gLang]
                                }
                            ]
                        }, {
                            type: "cluster",
                            align_children: "align_left",
                            elements: [
                                {
                                    type: "check_box",
                                    alignment: "align_left",
                                    item_id: "auxi",
                                    name: dialogBoxes.formatDetection.auxiliary[global.gLang],
                                }, {
                                    type: "radio",
                                    item_id: "noa3",
                                    group_id: "rada",
                                    name: dialogBoxes.formatDetection.a3_as_a4[global.gLang],
                                }, {
                                    type: "radio",
                                    item_id: "no34",
                                    group_id: "rada",
                                    name: dialogBoxes.formatDetection.a3a2_as_a4[global.gLang],
                                }
                            ]
                        }

                        //добавить Read Unknow format as A4

                    ]
                }, {
                    type: "view",
                    align_children: "align_row",
                    elements: [{
                        type: "static_text",
                        name: menuSections.sign.short,
                        font: "palette"
                    }, {
                        type: "gap",
                        width: 110,
                    }, {
                        type: "ok_cancel",
                        ok_name: "Ok",
                        cancel_name: "Cancel",
                    }]
                }]
            },]
        }
    };

    if ("ok" == String(app.execDialog(formatDetectionDialog))) {
        testShowRanges(formatDetectionDialog.check);
    }
    app.endPriv();
});



