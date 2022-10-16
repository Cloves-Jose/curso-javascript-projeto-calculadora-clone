class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        //Manipulando a DOM atraves do ID da tag HTML que é usado pelo CSS
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._operation = [];
        this._currentDate;
        this._locale = 'pt-BR'
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    /**
     * Colar da área de transferência
     */
    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            console.log(text);
        })
    }

    /**
     * Copiar para a área de transferência
     */
    copyToClipboard() {
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    /**
     * Este método contera tudo o que deve ser inicializado 
     * assim que a página da calculadora for aberta.
     */
    initialize() {
        //Realiza a exibição assim que entrar na página
        this.setDisplayDateTime();
        //Executa uma função com um determinado intervalo de tempo em ms. para atualizar a hora e a data
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);

        //Exibe o valor 0 assim que a página é carregada
        this.setLastNumberToDisplay();

        //Cola os eventos da área de transferência
        this.pasteFromClipboard();

        //Adicionar evento de duplo cloque no botão
        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        })
    }

    /**
     * Verifica se o áudio está ligado ou desligado
     */
    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }

    /**
     * Método para reproduzir o som da calculadora 
     */
    playAudio() {

        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    /**
     * Inicializa os eventos de teclado da calculadora
     */
    initKeyboard() {
        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '%':
                case '/':
                case '*':
                case '-':
                case '+':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    /**
     * Vai receber todos os eventos de click do mouse
     */
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn);
        })
    }

    /**
     * Vai limpar todos os valores da calculadora
     */
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    /**
     * Vai apagar a última entrada na calculadora e 
     * manter as entradas anteriores
     */
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    /**
     * Vai pegar a última posição do array
     * @returns number
     */
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    /**
     * Concatena o último valor do array com o valor adicionado
     * @param {number} value 
     */
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    /**
     * Verificar se o último item clicado é um 
     * operador ou não
     * @param {string} value 
     * @returns true or false
     */
    isOperator(value) {
        //Vai verificar se o valor existe no array
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    /**
     * Vai realizar o push em _operator
     * @param {string} value 
     */
    pushOperator(value) {
        this._operation.push(value);

        if(this._operation.length > 3) {
            console.log(this.calc());
            
        }
    }

    
    /**
     * Vai pegar o último resultado
     * 
     * @returns resultado
     */
    getResult() {
        try{
            return eval(this._operation.join(""));

        }catch(e) {
            setTimeout(() => {
                this.setError(e);
            }, 1);
        }
    }

    /**
     * Pega os três últimos valores adicionados e 
     * realiza a operação antes de adicionar um novo 
     * valor ao array.
     */
    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%') {
            result /= 100;

            this._operation = [result];
        } else {
            this._operation = [result];

            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    /**
     * Pega último número ou último operador 
     * digitado
     */
    getLastItem(isOperator = true) {

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--) {
            if(this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        
        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    /**
     * Exibe o produto da última operação realizada 
     * no display 
     */
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    /**
     * Vai adicionar uma operação matemática a 
     * calculadora
     */
    addOperation(value) {

        if(isNaN(this.getLastOperation())) {

            if(this.isOperator(value)) {
                
                //Trocar o operador
                this.setLastOperation(value);

            } else {
                
                this.pushOperator(value);

                this.setLastNumberToDisplay();
            }
        } else {    
            if(this.isOperator(value)) {

                this.pushOperator(value)
            } else {

                //Number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }
        }
    }

    /**
     * Erro que será exibido na calculadora
     */
    setError() {
        this.displayCalc = "Error"
    }

    /**
     * Adicionando o ponto
     */
    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperator('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    /**
     * Vai tratar os eventos dos botoes quando clicados
     */
    execBtn(value) {

        this.playAudio();

        switch (value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break;
            default:
                this.setError();
                break;
        }
             
    }

    /**
     * Adiciona os eventos aos botões da calculadora
     */
    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        //Percorrer todos os botões
        buttons.forEach((btn, index) => {
            
            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.className.baseVal.replace("btn-","");

                this.execBtn(textBtn);
            })

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";
            })
        })

    }

    /**
     * Captura data e hora de acordo com o país selecionado.
     */
    setDisplayDateTime() {
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        //Vai atribuir um valor no formato HTML para cada id selecionado
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        //Vai atribuir um valor no formato HTML para cada id selecionado
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        //Vai atribuir um valor no formato HTML para cada id selecionado
        if(value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}