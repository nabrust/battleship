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
    enemuShips = [], // хранить карабли компьютера
    computerFire = []; // хранит ячейки по которым стрелял компьютер

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
    console.log(myShips);
  };

  // Логика компьютера
  var computerLogic = function () {
    var
        fieldCell = $('.battlefields__my-field').find('.table-cell').not('.hat'), // поле игрока
        nubCell = fieldCell.length, // узнаем количество ячеек
        selectAim = Math.floor((Math.random() * nubCell)), // выбор ячейки по которой компьютер будет стрелять
        cell = fieldCell.eq(selectAim), //клетка по которой произведен выстрел
        cellId = cell.attr('id'),
        computerflagHit = false,
        myShipsLenght = myShips.length;

    var computerTestHit = function () {
      for (var i = 0; i < myShips.length; i++) {
        var test = $.get(myShips[i].location, function (el,n) {
          if (el === cellId) {
            return true;
          } else {
            return false;
          }
        });
        if (checkPos.length !== 0) {
          computerflagHit = true;
          break;
        }
      }
    };
    // if (computerflagHit === true) {
    //   myShips[myShipsLenght] = cellId;
    // }
    _view(cell,'fire','myDisplay');
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
        cellId = cell.attr('id'),
        flagHit = false; //узнаем id клетки

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
        flagHit = true;
        break;
      }
    }
    if (flagHit === true && mode === 'fire') {
      _marker('fire',cell,'hit');
    } else if (flagHit === false && mode === 'fire') {
      _marker('fire',cell,'miss');
    } else if (flagHit === true && mode === 'myShips') {
      _marker('myShips',cell);
    }
  };



  // Функция, которая ставит метки в ячейку в заисимости от результата выстрела,
  // функция получает ячейку (cell) по которой был произведен выстрел и результат
  // этого выстрела.
  var _marker = function (mode,cell,result) {
    if (mode === 'myShips') {
      cell.append('<div class="showMyShips"></div>');
    } else if (mode === 'fire') {
      if (result === 'hit') { // если результат был попаданием то ставим метку с классом "hit"
        cell.append('<div class="hit"></div>');
      }else if (result === 'miss') { //если попадания не было то ставим метку с классом "miss"
        cell.append('<div class="miss"></div>');
      }
    }
  };


  // Функцияб которая создает карабли
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
            characterArray = ['a','b','c','d','e','f','g','h','i','j'],
            location = [],
            i = 0;

        if (direction === 'horizontally') {
          var
            horizontal = Math.floor((Math.random() * (fieldSize - shipsLenght + 1))),
            vertically = Math.floor((Math.random() * fieldSize) + 1);

          for (i; i < shipsLenght; i++) {
            location[i] = characterArray[horizontal + i] + vertically;
          }

          return location;

        } else if (direction === 'vertically') {
          var
            vertically = Math.floor((Math.random() * (fieldSize - shipsLenght + 1) + 1)),
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
        for (var i = numShips; i > 0;) {
          if (createShip() !== false) {
            i--;
          }
        }

      };
      shipsArray();

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
