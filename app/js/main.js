var battleship = (function(){



  //Инициализация функций
  var init = function () {
    _setUpListners();
  };



  // Прослушка событий
  var _setUpListners = function () {
    $('.table-cell').not('.hat').on('click',function () {
      shipsСreat();
    });
  };



  // Объявление переменных, в которых буду храниться данные об игре
  var
    fieldSize = 10,
    numShips = 3,
    shipsLenght = 3,
    shipsKilled = 0,
    ships = [];




  // Функция срабатывает при выстреле и вроверяет был ли там карабль,
  // в cell передаем ячейку по которой был произведен выстрел.
  var _shot = function (cell) {

    var cellId = cell.attr('id'); //узнаем id клетки

    // Проверяем позиции караблей из массива ships на совпадение с позицией
    // по которому стреляли.
    var checkPos = $.grep(ships[0].location,function (el,n) { // Утилита JQuery, которая обходит каждый элемент массива
        if (el === cellId) {
          return true;
        } else {
          return false;
        }
      });
    // Исходя из результата проверки массива ships ставим метку на квадрат.
    if (checkPos.length !== 0) {
      _view(cell,'hit');
    } else {
      _view(cell,'miss');
    }
  };



  // Функция, которая ставит метки в ячейку в заисимости от результата выстрела,
  // функция получает ячейку (cell) по которой был произведен выстрел и результат
  // этого выстрела.
  var _view = function (cell,result) {
    if (result === 'hit') { // если результат был попаданием то ставим метку с классом "hit"
      cell.append('<div class="hit"></div>');
    }else if (result === 'miss') { //если попадания не было то ставим метку с классом "miss"
      cell.append('<div class="miss"></div>');
    }
  };



  var shipsСreat = function () {

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
                    console.log('Массив караблей ' + ships[i].location);
                    console.log('Массив нового карабля ' + shipPos);
                    console.log('Есть совпадение ' + collisionTest);
                    collisionFlag = false;
                    break;
                  }
                }
                if (collisionFlag === false) { // Если функция collisionTest  нашла повторения, то выходим из внешнего цикла
                  return false;
                  break;
                } else { // Если функция collisionTest не нашла повторений, то записываем созданный карабль в массив ships
                  ships[shipsArrayLength] = {location : shipPos, hits : []};
                  console.log('------------ Создан ' + (shipsArrayLength + 1) + ' карабль');
                  console.log(ships);
                }
              }
            } else { // если карабли не были созданы ранее то мы добавим новый карабль без проверки массива ships
              console.log('Первоначальная длина ships ' + ships.length);
              ships = [{location : shipPos, hits : []}];
              console.log('Создан первый карабль ' + ships[0].location);
            }
          };
          collision();
        };
        createShip();

        return ships;

      };
      shipsArray();



  };


  return {
      init: init
  };

})();
battleship.init();
