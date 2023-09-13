// 1. Напишите функцию deepEqual для проверки двух обьектов на идентичность.

const isObject = (object) => object !== null && typeof object === "object"; // функція перевіряє чи передана змінна є об'єктом та чи вона не є значенням null

const deepEqual = (object1: any, object2: any): boolean => {
  // ініціалізуємо дві змінні які дорівнюють масиву ключів з кожного обєкта
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  // перевіряємо чи довжини тобто закальна кількість ключів є однакова у keys1 та keys2, якщо ні повертаємо false
  if (keys1.length !== keys2.length) {
    return false;
  }
  // Робимо цикл який проходиться по кожному ключі об'єкта
  for (const key of keys1) {
    // ініціалізуємо дві змінні які будуть змінюватись при кожні ітерації, дорівнюють поточному ключю об'єкта
    const item1 = object1[key];
    const item2 = object2[key];
    const areObjects = isObject(item1) && isObject(item2); // Проводимо перевірку, чи обидва значення item1 та item2 є об'єктами

    if (
      (areObjects && !deepEqual(item1, item2)) || // якщо обидва значення є об'єктами, нам потрібно заглибитись ще на один рівень, це досягається за допомогою рекурсії
      (!areObjects && item1 !== item2) // якщо змінні не є об'єктами тобто ми на останньому рівні, перевіряємо чи значення ( ключі) дорівнюють один одному, якщо ні повертаємо false
    ) {
      return false;
    }
  }
  // якщо всі рівні об'єктів пройдено та ключі однакові повертаємо true
  return true;
};

// 2. Напишите функцию генератор chunkArray, которая возвращает итератор возвращающий части массива указанной длинны.

// Оголошуємо функцію генератор контсрукцією function*
function* chunkArray(array: number[], length: number) {
  // Робимо цикл по всій довжині масива з кроком length
  for (let i = 0; i < array.length; i += length) {
    yield array.slice(i, i + length); // використовуємо yield що б повернути частину масиву array довжиною lenght яка починається з індексу i
  }
}

// 3. Напишите функцию обертку, которая на вход принимает массив функций и их параметров, а возвращает массив результатов их выполнения. Количество аргументов исполняемой функции не ограничено!

const bulkRun = async (functions) => {
  const results = []; // робимо контейнер у який будемо пушити результат виконання функцій

  for (const [func, args] of functions) { // робимо цикл де деструктуризуємо кожен елемент масиву на func та args
    // так як можуть приходити асинхронні функції такі як setTimeout використовуємо await та Promise що б дочекатись виконання функцій
    const result = await new Promise((resolve) => {
      // викликаємо виконання функції та передаємо у фунцію всі аргументи та value
      func(...args, (value) => {
        resolve(value); // результат викоання функції записується у value
      });
    });
    results.push(result); // пушимо наш результат у масив результатів
  }

  return results; // повертаємо масив результатів
}


//4. Напишите метод arrayToObject, который превращает массив в объект (использовать рекурсию).

// ініціалізуємо функцію яка приймає як аргумент масив
function arrayToObject(arr: any[]) {
  // за допомогою методу map проходимось по кожному елементу масива попередньо його деструктуризувавши на key та value
  const entries = arr.map(([key, value]) => {
    // Робимо перевірку чи елмент є масивом
    if (Array.isArray(value)) {
      return [key, arrayToObject(value)]; // рекурсивно викликаємо функцію для вкладених масивів
    } else {
      return [key, value]; // повертаємо ключ значення
    }
  });
  console.log(entries);
  // отримуємо простий масив з ключ значення
  return Object.fromEntries(entries); // за допомогою методу fromEntries перетворюємо пари ключ-значення у об'єкт
}

// 5. Написать обратный метод (см. задачу 4) objectToArray, который из объекта создаст массив.

const objectToArray = (obj: any): any[] => {
  // Робимо конвертацію з об'єкта за допомогою методу entries
  // так як Object.entries(obj) це вже масив викликаємо в нього функцію map що б проітеруватись по кожному елементу масива
  return Object.entries(obj).map(([key, value]) => {
    // Робимо перевірку чи значення має тип об'єкт
    if (typeof value === "object") {
      return [key, objectToArray(value)]; // рекурсивно конвертуємо вкладений об'єкт
    }
    return [key, value]; // повертаємо масив
  });
};

// 6. Есть функция primitiveMultiply, которая умножает числа, но случайным образом может выбрасывать исключения типа: NotificationException, ErrorException. Задача написать функцию обертку которая будет повторять вычисление при исключении NotificationException, но прекращать работу при исключениях ErrorException
function NotificationException() {}
function ErrorException() {}
function primitiveMultiply(a: number, b: number) {
  const rand = Math.random();
  if (rand < 0.5) {
    return a * b;
  } else if(rand > 0.85) {
    throw new ErrorException()
  } else {
    throw new NotificationException()
  }
}
const reliableMultiply = (a: number, b: number): number | string =>{
  // Використовуємо конструкцію try catch
  try {
    return primitiveMultiply(a, b); // виконуємо функцію множення
  } catch (error) {
    if (error instanceof NotificationException) {
      // за допогою оператора instanceof перевіряємо чи є NotificationException у прототипі error
      return reliableMultiply(a, b); // якщо виникає полика повторюємо обрахування
    } else if (error instanceof ErrorException) {
      return `Виникла помилка, обрахування зупинено`; // завершуємо обрахування повертаємо текст
      // також можна зупинити обрахування за допомогою break
    } else {
      throw error; // Відловлюємо інші помилки
    }
  }
}

// 7.  Напишите функцию, которая берет объект любой вложенности и преобразует ее в единую плоскую карту с разными уровнями, разделенными косой чертой ( '/').

const mapObject = (obj) => {
  const result = {}; // створюємо контейнер у який мудемо записувати наші шляхи
  // створюємо функцію рекурсію якою будемо проходить по кожному шляху
  const findPath = (current, path = []) => {
    //  оголошуємо цикл для проходження по всіх ключах обєкту
    for (const key in current) {
      const value = current[key]; // ініціалізуємо змінну яка буде дорівнювати значенню ключа для кожної ітерації
      const newPath = path.concat(key); // записуємо значення ключа у новий масив

      if (typeof value === "object" && !Array.isArray(value)) {
        // перевіряємо чи є значення об'єекто та чи не є масивом
        findPath(value, newPath); // якщо значення об'є'кт проходимось по ньому в пошуку подальшого маршруту
      } else {
        result[newPath.join(`/`)] = value; // якщо значення не об'єкт або масив, з'єднюємо масив результатів методом join, отримаємо стрінгу, записуємо цю стрінгу як ключ і даємо їй значення value
      }
    }
  };

  findPath(obj); // викликаємо функцію з пошуку шляху

  return result; // повертаємо результат
};


// 8. Напишите функцию combos, которая принимает положительное целое число num и возвращает массив массивов положительных целых чисел, где сумма каждого массива равна  num.  Массивы не должны повторяться.


const combos = (num: number): number[][] =>{
  const results: number[][] = []; // створюємо контейнер для результатів

  // створюємо нону функцію findCombinations яка буде використовуватись для пошуку нових комбінацій, функція приймає target число яке потрібно отримати в сумі, currentCombo масив чисил наша комбінація чисел, та start число з якого ми починаємо обрахунок
  const findCombinations = (target: number, currentCombo: number[], start: number): void =>{
    // перевірка чи ми знайшли комбінацію чисел яка в сумі дає target якщо так додаємо до результатів
    if (target === 0) {
      results.push([...currentCombo]);
      return;
    }
    // цикл пошуку комбінацій, спочатку і  = старт
    for (let i = start; i <= target; i++) {
      currentCombo.push(i); // додаємо і до масиву чисел
      findCombinations(target - i, currentCombo, i); // запускаємо рекурсивно функцію але передаємо target мету на і меньше, та повторюємо цикл пошуку 
      currentCombo.pop(); // коли комбінація зібрана,  ми видаляємо останнє значення з масиву чисел, та повторюємо цикл з і + 1 для пошуку наступної підходящої комбінації чисел
    }
  }

  findCombinations(num, [], 1); // запускаємо функцію з початковими данними

  return results; // повертаємо результат масив комбінацій чисел
}

// 9.  Напишите функцию add, которая бы работала следующим образом add(1)(2)(7)...(n). Количество последовательных визовов неограничено.
// використовуємо каррінг
const add = (a: number): number => {
  // робимо функцію обгортку яка приймає друге значення яке передаємо
  return function (b) {
    // робимо перевірку якщо ми таке значення не передали повертаємо а
    if (!b) {
      return a;
    }
    // якщо значення є то використовуючи рекурсію викликаємо знову фукнцію add в яку передаємо значення аргумента сумму а та b
    return add(a + b);
  };
};
