$(document).ready(function () {

  var popup = $('.popup-start').bPopup({
       modalClose: false
     });
  $('.button-for-popup').on('click',function () {
    var playerName = $('#inputByPopup').val(),
        playerStepText = $('#playerStep').find('.message__str'),
        message = $('#playerStep');
    popup.close();
    playerStepText.text('Ваш ход ' + playerName);
    message.show();
  });

  battleship.init();
});



var battleship = (function() {



  //Инициализация функций
  var init = function() {
    myDisplay();
    enemyDisplay();
    _setUpListners();
  };



  // Прослушка событий
  var _setUpListners = function() {
    $('.battlefields__enemy-field').find('.table-cell').not('.hat').on('click', funcForClick);
  };



  // Объявление переменных, в которых буду храниться данные об игре
  var
    forFlahStap = false,
    fieldSize = 10,
    numShips = 4,
    shipsLenght = 3,
    playerShipsKilled = 0,
    computerShipsKilled = 0,
    myShips = [],
    enemuShips = [],
    computerHit = [], // массив нужен для того чтобы компьютера запомнил место куда стрелял если было попадание
    characterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], // массив букв для горизонтали
    computerLogicObj = {}, // объект нужен для того чтобы компьютер запоминал куда нужно стрелять до тех пор пока найденный карабль не был потоплен
    playerShots = [], //Массив хранит выстрелы игрока
    fireDirection = ['left','right', 'up', 'down']; // массив направлений для компьютера


  var funcForClick = function () {
    fire($(this), 'player');
    $(this).off('click');
    setTimeout(computerLogic, 1000);
    messageControl('computer');
    $('.table-cell').off('click');
    // Intervallllllllllllllll = setInterval(computerLogic, 100);
  };


  // Создать игровое поле игрока
  var myDisplay = function() {
    shipsСreat('myShips');
    $('.battlefields__my-field').find('.table-cell').not('.hat').each(function() {
      _view($(this), 'myShips', 'myDisplay');
    });
  };


  // Создать игрово поле компьютера
  var enemyDisplay = function() {
      shipsСreat('enemuShips');
  };


  var endPopup = function (message) {
    var poupEnd = $('.poup-end'),
        poupEndStr = poupEnd.find('.message-end');
    poupEndStr.text(message);
    poupEnd.bPopup({
      modalClose: false
    });
  };


  var messageControl = function (e) {
    var message = $('.message'),
        playerStep = message.find('#playerStep'),
        computerStep = message.find('#computerStep');

    if (e === 'computer') {
      playerStep.hide();
      computerStep.show();
    }else if (e === 'player') {
      computerStep.hide();
      playerStep.show();
    }
  };


  // Логика компьютера
  var computerLogic = function() {

    var
      fieldCell = $('.battlefields__my-field').find('.table-cell').not('.hat'), // поле игрока
      nubCell = fieldCell.length; // узнаем количество ячеек


    var randomAim = function () {
      var randomAimFlag = false,
          selectAimRandom, // выбор ячейки по которой компьютер будет стрелять рандомно
          aim;

      var findAim = function () {
        var randomCell = fieldCell.eq(selectAimRandom); // находим эту ячейку
        aim = randomCell.attr('id'); // узнаем его id

        var findAimTest = computerHit.some(function(item){return item === aim;});
        if (findAimTest === true) {
          randomAimFlag = false;
        } else if (findAimTest !== true) {
          randomAimFlag = true;

        }
      };

      for (;randomAimFlag === false;) {
        selectAimRandom = Math.floor((Math.random() * nubCell));
        findAim();
      }
      return aim;
    };


    // Сохранить выстрел в массив computerHit, если computerLogicObj.firstHit
    // не существует то создать его с ячейкой по которой выстрелили.
    var saveComputerHit = function(cell) {
        computerHit[computerHit.length] = cell.attr('id');
        if (computerLogicObj.firstHit === undefined && cell.children().is('.hit') === true) {
          computerLogicObj.firstHit = cell;
        } else if (cell.children().is('.hit') !== true) {
          delete computerLogicObj.logic;
        }
    };

    // Функция extractCharacters узнает id ячейки по которой стреляли, сохраняет ее цифру и
    // узнает индекс ее буквы в массиве characterArray
    var extractCharacters = function(cell) {
      var cellId = cell.attr('id'), // узнаем id ячейки в которую попали
        num = Number(cellId.replace(/\D+/g, '')), // узнаем горизонталь ячейки
        character = cellId.replace(/[0-9]/g, ''), // узнаем вертикаль ячейки
        characterIndex = characterArray.indexOf(character); // находим индекс буквы


      return {
        num: num,
        characterIndex: characterIndex
      };

    };

    // Фукнция selectAim выберает цель по которой компютер будет стрелять
    var selectAim = function(cell) {
      var findAimFlag = false, // флаг сигнализирует о том, что ячейка была найдена
          aimId; // переменная будет хранить id клетки для выстрела


      var directionControl = function () {

            leftCounter = 0,
            rightCounter = 0,
            upCounter = 0,
            downCounter = 0,
            fireDirection = ['left','right', 'up', 'down'];

      };
      // Функция findAim узнает в какую сторону будем стрелять, направление берется из первого значения
      //  массива fireDirection, при выборе цели, функция так же проверяет есть место для того,
      // чтобы выстрелить в выьраном направлении, так же проверяется есть ли место для для следующего
      // выстрела в выбраном направлении, если нет, то текущее направление удаляется из массива направлений (fireDirection).
      var findAim = function () {
        var direction = fireDirection[0], // направление стрельбы
            values = extractCharacters(cell), // узнаем какое число и какой индекс буквы в id
            number = values.num, // запомнить цифру
            lettersIndex = values.characterIndex; // запомнить индекс буквы из массива characterArray
        if (direction === undefined) {
          directionControl();
        }
        if (direction === 'left' && lettersIndex !== 0) {
          // console.log('Стреляю влево');
          // console.log('lettersIndex = ' + lettersIndex);
          // console.log('-----------------');
          lettersIndex--;
          aimId = characterArray[lettersIndex] + number;
        } else if (direction === 'right' && lettersIndex !== (fieldSize - 1)) {
          // console.log('Стреляю вправо');
          // console.log('lettersIndex = ' + lettersIndex);
          // console.log('-----------------');
          lettersIndex++;
          aimId = characterArray[lettersIndex] + number;
        } else if (direction === 'up' && number !== 1){
          // console.log('Стреляю вверх');
          // console.log('number = ' + number);
          // console.log('-----------------');
          number--;
          aimId = characterArray[lettersIndex] + number;
        } else if (direction === 'down' && number !== fieldSize) {
          // console.log('Стреляю вниз');
          // console.log('number = ' + number);
          // console.log('-----------------');
          number++;
          aimId = characterArray[lettersIndex] + number;
        } else {
          // console.log('Не нашел вариантовб в какую сторону стрелять');
        }

        // Проверяем выбраную ячейку на стрельбу по ней ранее
        var aimTest = computerHit.some(function(item){return item === aimId;});


        // Если по выбраной ячейке ранее не стреляли, то поставить флаг true,
        // что значит, что компьютер выбрал чцель по которой будет стрелять,
        // иначе удаляем направление по которой стреляли из массива fireDirection,
        // оставляем флаг в положении false, чтобы компьютер выбрал другую цель.
        if (aimTest !== true) {
          findAimFlag = true;
          computerLogicObj.logic = fieldCell.filter('#' + aimId);
        } else if (aimTest === true) {
          findAimFlag = false;
          fireDirection.shift();
        }
      };

      // Вызываем поиск цели до тех пор пока не подберем нужную.
      for (y = 0; findAimFlag === false; y++) {
        findAim();

        if (y > shipsLenght) {
          y = 0;
          fireDirection = ['left','right', 'up', 'down']; // массив направлений для компьютера
          computerLogicObj = {};
          console.log("обновляю массив");
        }

        if (y>10000) {
          // console.log('Цикл остановен, очищаю setInterval');
          // console.log('+++++++ Отчет +++++++');
          // console.log(' ');
          // console.log('myShips = ');
          // console.log(myShips);
          // console.log(',enemuShips = ');
          // console.log(enemuShips);
          // console.log(',computerHit = ');
          // console.log(computerHit);
          // console.log(',computerLogicObj = ');
          // console.log(computerLogicObj);
          // console.log(' ');
          // console.log('+++++++ Отчет +++++++');
          // clearInterval(Intervallllllllllllllll);
          // break;
        }
      }

      return aimId;
    };

    // Функция testKilled проверяет потопил ли комьютер карабль игрока, если потопил
    // то обнуляет объект computerLogicObj, чтобы следующий выстрел компьютера
    // карабля был произвольным.
    var testKilled = function () {
      var
        cellHit = computerLogicObj.firstHit, // узнаем в какую ячейку было попадание
        cellHitId = cellHit.attr('id'); // узнаем id ячейки
      // Узнаеть по какому караблю стреляли
      var searchingShip = function () {
        for (var i = 0; i < myShips.length; i++) {
          var searching = myShips[i].location.some( function(item){ return item === cellHitId;});
          if (searching === true) {
            return i;
          }
        }
      };

      // Проверить попадания карабля
      var hitOnShip = myShips[searchingShip()].hits;

      // Если попаланий по кораблю было 3, то обнуляем массив computerLogicObj
      if (hitOnShip.length === shipsLenght) {
        computerLogicObj = {};

      }

    };

    var controller = (function() {
      if (computerLogicObj.firstHit === undefined) {
        var cell = fieldCell.filter('#' + randomAim());
        fire(cell,'computer');
        saveComputerHit(cell);
      } else {
        if (computerLogicObj.logic === undefined) {
          var cell = fieldCell.filter('#' + selectAim(computerLogicObj.firstHit));
        } else {
          var prevCellId = computerLogicObj.logic;
          var cell = fieldCell.filter('#' + selectAim(prevCellId));

        }

        fire(cell,'computer');
        saveComputerHit(cell);
        testKilled();
      }
    })();

  };


  // Функция выстрела, она принимает ячейку по которой был произведен выстред
  // и инициатора выстрела (игрок или компьютер).
  var fire = function(cell, initiator) {

    var controller = function() {
      if (initiator === 'player') {
        _view(cell, 'fire', 'enemyDisplay');
        if (cell.children().is('.hit')) { // если было попадание
          saveHit(cell, enemuShips);
        }
      } else if (initiator === 'computer') {
        _view(cell, 'fire', 'myDisplay');
        if (cell.children().is('.hit')) { // если было попадание
          saveHit(cell, myShips);
        }
      }
      messageControl('player');
      $('.battlefields__enemy-field').find('.table-cell').not('.hat').on('click', funcForClick);
    };
    // Функция для сохранения попаданий
    var saveHit = function(cell, shipsArray) {
      var cellId = cell.attr('id'),
        shipHitFlag = false;

      var kill = function(hitsArray) {
        if (hitsArray.length === shipsLenght) {
          if (initiator === 'player') {
            playerShipsKilled++;
          } else if (initiator === 'computer') {
            computerShipsKilled ++;
          }
          if (computerShipsKilled === numShips) {
            endPopup('Вы проиграли!');
          } else if (playerShipsKilled === numShips) {
            endPopup('Вы победили!');
          }
        }
      };
      // Функция, которая узнает по какому караблю папали и сохраняет куда попали
      for (var i = 0; i < shipsArray.length; i++) {
        for (var j = 0; j < shipsArray[i].location.length; j++) {
          var shipHit = shipsArray[i].location.some(function(item){return item === cellId;});

          if (shipHit === true) {
            shipHitFlag = true;
            break;
          }
        }
        if (shipHitFlag === true) {
          break;
        }
      }
      if (shipHitFlag === true) {
        var hitsArrayLength = shipsArray[i].hits.length;
        shipsArray[i].hits[hitsArrayLength] = cellId; //записываем координату в массив hits для карабля в который попали.
        kill(shipsArray[i].hits); // функция для проверки потопления караблей
      }
    };
    controller();
  };


  // Функция, которая отвечает за показ караблей и показ результата выстрела,
  // получает ячйку которую нужно проверить cell и режим для маркеров mode
  var _view = function(cell, mode, display) {
    if (display === 'myDisplay') {
      var ships = myShips;
    } else if (display === 'enemyDisplay') {
      var ships = enemuShips;
    }
    var
      cellId = cell.attr('id'), //узнаем id клетки
      flagHit = false; // флагб будет сигнализировать о нахождении карабля
    var _marker = function(mode, cell, result) {
      if (mode === 'myShips') {
        cell.addClass('myShips'); // показывает карабли игрока
      } else if (mode === 'fire') {
        if (result === 'hit') { // если результат был попаданием то ставим метку с классом "hit"
          cell.append('<div class="hit"></div>');
        } else if (result === 'miss') { //если попадания не было то ставим метку с классом "miss"
          cell.append('<div class="miss"></div>');
        }
      }
    };


    // Проверяем позиции караблей из массива ships на совпадение с позицией
    // по которому стреляли.
    for (var i = 0; i < ships.length; i++) {
      var checkPos = ships[i].location.some(function(item){return item === cellId;});
      // Исходя из результата проверки массива ships ставим метку на квадрат.
      if (checkPos === true) {
        flagHit = true; // ставим флаг на TRUE если был найден карабль
        break;
      }
    }
    if (flagHit === true && mode === 'fire') { // Если было попадание и стоял стрелятьб
      _marker('fire', cell, 'hit'); // то ставим маркер для попадания
    } else if (flagHit === false && mode === 'fire') { // Если не было попадание и стоял стрелятьб
      _marker('fire', cell, 'miss'); // то ставим маркер  попадания нет
    } else if (flagHit === true && mode === 'myShips') { //Это условие срабатывает если был найден карабль в режиме "Показать мои карабли"
      _marker('myShips', cell);
    }
  };




  // Функция, которая создает карабли, она принимает поле в котором нужно
  // создать карабли.
  var shipsСreat = function(display) {
    var
      ships = [];

    // Функция, которая рандомно генерирует направление карбля
    var shiDirection = function() {
      var randomNum = Math.round(Math.random());
      if (randomNum === 0) {
        return 'horizontally';
      } else if (randomNum === 1) {
        return 'vertically';
      }
    };

    // Функция, которая создает координаты караблей
    var position = function(direction) {
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
    var shipsArray = (function() {

      // Функция, которая создает карабли и проверяет на перекрытие
      var createShip = function() {
        var
          shipPos = position(shiDirection()); // создаем карабль

        // Проверяем созданный карабль на перекрытие координат из массива ships
        var collision = function() {
          var collisionFlag = true;

          if (ships.length !== 0) { // Проверяем массив ships на наличие созданных караблей.
            var shipsArrayLength = ships.length; // Сохраняем длину массива ships для передачи ее в цикда и для создания нового карабля в массиве.

            for (var i = 0; i < shipsArrayLength; i++) {
              for (var j = 0; j < shipPos.length; j++) {
                var collisionTest = ships[i].location.some(function(item){return item === shipPos[j];});
                if (collisionTest === true) { // Если проверка collisionTest имеет совпадение, то ставим флаг collisionFlag в значение false из внутреннего цикла
                  collisionFlag = false;
                  break;
                }
              }
            }
            if (collisionFlag === false) { // Если функция collisionTest  нашла повторения, то выходим из внешнего цикла
              collisionFlag = true;
              return false;
            } else if (collisionFlag === true) { // Если функция collisionTest не нашла повторений, то записываем созданный карабль в массив ships
              ships[shipsArrayLength] = {
                location: shipPos,
                hits: []
              };
            }
          } else if (ships.length === 0) { // если карабли не были созданы ранее то мы добавим новый карабль без проверки массива ships
            ships = [{
              location: shipPos,
              hits: []
            }];
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

    })();

    // Условие ниже присваивает созданные карабли к определенному полю
    if (display === 'myShips') {
      myShips = ships;
    } else if (display === 'enemuShips') {
      enemuShips = ships;
    }

  };

  return {
    init: init
  };

})();
