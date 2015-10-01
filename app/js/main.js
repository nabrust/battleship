var battleship = (function(){



  //Инициализация функций
  var init = function () {
    myDisplay();
    enemyDisplay();
    _setUpListners();
  };



  // Прослушка событий
  var _setUpListners = function () {
    $('.battlefields__enemy-field').find('.table-cell').not('.hat').on('click',function () {
      _view($(this),'fire','enemyDisplay');
      setTimeout(computerLogic, 1000);
    });
  };



  // Объявление переменных, в которых буду храниться данные об игре
  var
    fieldSize = 10,
    numShips = 3,
    shipsLenght = 3,
    shipsKilled = 0,
    myShips = [], // хранит карабли игрока
    enemuShips = [],// хранить карабли компьютера
    computerHit = [], // массив нужен для того чтобы компьютера запомнил место куда стрелял если было попадание
    characterArray = ['a','b','c','d','e','f','g','h','i','j'], // массив букв для горизонтали
//-----------------------НУЖНО СДЕЛАТЬ ФУНКЦИЮ, КОТОРАЯ БУДЕТ СОЗДАВАТЬ ОБЪЕКТ ДЛЯ
//-----------------------ТОГО ЧТОБЫ КОМПЬТЕР МОГ ЛОГИЧНО СТРЕЛЯТЬ ПОСЛЕ ТОГО КАК
//-----------------------ОБНАРУЖИЛ КАРАБЛЬ

  // Функция, которая создает игровое поле игрока
  var myDisplay = function () {
    shipsСreat('myShips');
    $('.battlefields__my-field').find('.table-cell').not('.hat').each(function () {
      _view($(this),'myShips','myDisplay');
    });
  };

  var enemyDisplay = function () {
    shipsСreat('enemuShips');
    $('.battlefields__enemy-field').find('.table-cell').not('.hat').each(function () {
      _view($(this),'myShips','enemyDisplay');
    });
  };

  // Логика компьютера
  var computerLogic = function () {
    var
        fieldCell = $('.battlefields__my-field').find('.table-cell').not('.hat'), // поле игрока
        nubCell = fieldCell.length, // узнаем количество ячеек
        selectAim = Math.floor((Math.random() * nubCell)); // выбор ячейки по которой компьютер будет стрелять

    var logicAfterHit = function (cell) {
      var cellId = cell.attr('id'), // узнаем id ячейки в которую попали
          num = cellId.replace(/\D+/g, ''), // узнаем горизонталь ячейки
          character = cellId.replace(/[0-9]/g, ''); // узнаем вертикаль ячейки

      // Функция,которая будет узнавать индекс буквы в массиве characterArray
      var characterIndex = function () {
        var index = 0, // переменная, в которую будет сохранен индекс буквы в массиве characterArray
            j = 0;

        $.grep(characterArray, function (el, n) {
          if (el === character) {
            j++;
            index = n;
          } else {
            j++;
          }
        });

        return index;

      };

      var searchCell = function () {

      };
    };

    if (computerHit.length === 0) { // если нужен будет произвольный выстрел
      var cell = fieldCell.eq(selectAim); //клетка по которой произведен выстрел
      _view(cell,'fire','myDisplay');
      if (cell.children().is('.hit')) { // если было попаданиеб то сохраняем эту ячейку и говорим компьютеру делать следующий выстрел
        saveHit(cell);
        computerHit[computerHit.length] = cell.attr('id'); // записываем попадание каомпьютера
        logicAfterHit(cell);
      }
    } else if (computerHit.length !== 0) {
      logicAfterHit(computerHit[0]); // вызываем логику компьютера с первым попаданием
    }

  };

  // Функция для сохранения попаданий
  var saveHit = function (cell) {
    var cellId = cell.attr('id'),
        shipHitFlag = false;
    // Функция, которая узнает по какому караблю папали и сохраняет куда попали
    for (var i = 0; i < myShips.length; i++) {
      for (var j = 0; j < myShips[i].location.length; j++) {
        var shipHit = $.grep(myShips[i].location, function (el,n) {
          if (el === cellId) {
            return true;
          } else {
            return false;
          }
        });
        if (shipHit.length !== 0) {
          shipHitFlag = true;
          break;
        }
      }
      if (shipHitFlag === true) {
        break;
      }
    }
    if (shipHitFlag === true) {
      var hitsArrayLength = myShips[i].hits.length;
      myShips[i].hits[hitsArrayLength] = cellId; //записываем координату в массив hits для карабля в который попали.
      kill(myShips[i].hits);// функция для проверки потопления караблей
    }

  };

  var kill = function (hitsArray) {
    if (hitsArray.length === shipsLenght) {
      console.log('Потоплен карабль игрока');
      console.log(myShips);
    }
  };

  // Функция, которая отвечает за показ караблей и показ результата выстрела,
  // получает ячйку которую нужно проверить cell и режим для маркеров mode
  var _view = function (cell,mode,display) {

    if (display === 'myDisplay') {
      var ships = myShips;
    } else if (display === 'enemyDisplay') {
      var ships = enemuShips;
    }
    var
        cellId = cell.attr('id'), //узнаем id клетки
        flagHit = false; // флагб будет сигнализировать о нахождении карабля

    // Проверяем позиции караблей из массива ships на совпадение с позицией
    // по которому стреляли.
    for (var i = 0; i < ships.length; i++) {
      var checkPos = $.grep(ships[i].location,function (el,n) { // Утилита JQuery, которая обходит каждый элемент массива
          if (el === cellId) {
            return true;
          } else {
            return false;
          }
        });
      // Исходя из результата проверки массива ships ставим метку на квадрат.
      if (checkPos.length !== 0) {
        flagHit = true; // ставим флаг на TRUE если был найден карабль
        break;
      }
    }
    if (flagHit === true && mode === 'fire') { // Если было попадание и стоял стрелятьб
      _marker('fire',cell,'hit');               // то ставим маркер для попадания
    } else if (flagHit === false && mode === 'fire') {// Если не было попадание и стоял стрелятьб
      _marker('fire',cell,'miss');                    // то ставим маркер  попадания нет
    } else if (flagHit === true && mode === 'myShips') {//Это условие срабатывает если был найден карабль в режиме "Показать мои карабли"
      _marker('myShips',cell);
    }
  };


  // Функция, которая ставит метки в ячейку в заисимости от результата выстрела,
  // функция получает ячейку (cell) по которой был произведен выстрел и результат
  // этого выстрелаб так же получает режим (mode),для подборо нужного маркера
  var _marker = function (mode,cell,result) {
    if (mode === 'myShips') {
      cell.addClass('myShips'); // показывает карабли игрока
    } else if (mode === 'fire') {
      if (result === 'hit') { // если результат был попаданием то ставим метку с классом "hit"
        cell.append('<div class="hit"></div>');
      }else if (result === 'miss') { //если попадания не было то ставим метку с классом "miss"
        cell.append('<div class="miss"></div>');
      }
    }
  };


  // Функция, которая создает карабли, л=она принимает поле в котором нужно
  // создать карабли.
  var shipsСreat = function (display) {
      var
          ships = [];

      // Функция, которая рандомно генерирует направление карбля
      var shiDirection = function () {
        var randomNum = Math.round(Math.random());
        if (randomNum === 0) {
          return 'horizontally';
        }else if (randomNum === 1) {
          return 'vertically';
        }
      };

      // Функция, которая создает координаты караблей
      var position = function (direction) {
        var
            location = [], //переменнаяб которая будет хранить позиции караблей
            i = 0;

        if (direction === 'horizontally') { // создаем горизонтальный карабль
          var
            horizontal = Math.floor((Math.random() * (fieldSize - shipsLenght + 1))), // вычитаем длинну карабля, для того чтобы карабль не выходил за пределы поля
            vertically = Math.floor((Math.random() * fieldSize) + 1);

          for (i; i < shipsLenght; i++) {
            location[i] = characterArray[horizontal + i] + vertically;
          }

          return location;

        } else if (direction === 'vertically') { // создаем вертикальный карабль
          var
            vertically = Math.floor((Math.random() * (fieldSize - shipsLenght + 1) + 1)), // для вертикального карабля, наоборот вычитаем длинну карабля по вертикалиб чтобы карабль не выходил за пределы
            horizontal = Math.floor((Math.random() * fieldSize));

          for (i; i < shipsLenght; i++) {
            location[i] = characterArray[horizontal] + (vertically + i);
          }

          return location;

        }
      };

      // Создаем массив с данными караблей
      var shipsArray = function () {

        // Функция, которая создает карабли и проверяет на перекрытие
        var createShip = function () {
          var
              shipPos = position(shiDirection()); // создаем карабль

          // Проверяем созданный карабль на перекрытие координат из массива ships
          var collision = function () {
            var collisionFlag = true;

            if (ships.length !== 0) { // Проверяем массив ships на наличие созданных караблей.
              var shipsArrayLength = ships.length;  // Сохраняем длину массива ships для передачи ее в цикда и для создания нового карабля в массиве.

              for (var i = 0; i < shipsArrayLength; i++) {
                for (var j = 0; j < shipPos.length; j++) {
                  var collisionTest = $.grep(ships[i].location, function (el,n) { // Утилита JQuery, которая обходит каждый элемент массива
                    if (el === shipPos[j]) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (collisionTest.length !== 0) { // Если проверка collisionTest имеет совпадение, то ставим флаг collisionFlag в значение false из внутреннего цикла
                    collisionFlag = false;
                    break;
                  }
                }
              }
              if (collisionFlag === false) { // Если функция collisionTest  нашла повторения, то выходим из внешнего цикла
                collisionFlag = true;
                return false;
              } else if (collisionFlag === true) { // Если функция collisionTest не нашла повторений, то записываем созданный карабль в массив ships
                ships[shipsArrayLength] = {location : shipPos, hits : []};
              }
            } else if (ships.length === 0 ) {// если карабли не были созданы ранее то мы добавим новый карабль без проверки массива ships
              ships = [{location : shipPos, hits : []}];
            }

          };
          if (collision() === false) {
            return false;
          }

        };
        for (var i = numShips; i > 0;) { // этот цикл вызывает функцию создания караблей до тех пор пока не буду созданы нужное каличество караблейб которые не перекрываются
          if (createShip() !== false) {
            i--;
          }
        }

      };
      shipsArray();


      // Условие ниже привязывает созданные карабли к определенному полю
      if (display === 'myShips') {
        myShips = ships;
      }else if (display === 'enemuShips') {
        enemuShips = ships;
      }

  };


  return {
      init: init
  };

})();
battleship.init();
