class CalcController {

    constructor() {
        //Manipulando a DOM atraves do ID da tag HTML que é usado pelo CSS
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._operation = [];
        this._currentDate;
        this._locale = 'pt-BR'
        this.initialize();
        this.initButtonsEvents();
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
    }

    /**
     * Vai apagar a última entrada na calculadora e 
     * manter as entradas anteriores
     */
    clearEntry() {
        this._operation.pop();
    }

    /**
     * Vai pegar a última posição do array
     */
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    /**
     * Concateda o último valor do array com o valor adicionado
     */
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    /**
     * Verifica se o último item clicado é um
     * operador ou não
     */
    isOperator(value) {
        //Vai verificar se o valor existe no array
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    /**
     * Vai adicionar uma operação matemática a 
     * calculadora
     */
    addOperation(value) {

        if(isNaN(this.getLastOperation())) {
            //String
            if(this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value)
            } else if(isNaN(value)) {
                //Outra coisa
                //this.getLastOperation.toString + value.toString();
                console.log(value)
            } else {
                this._operation.push(value);
            }
        } else {    
            //Number
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newValue));
        }

        //this._operation.push(value);

        console.log(this._operation);
    }

    /**
     * Erro que será exibido na calculadora
     */
    setError() {
        this.displayCalc = "Error"
    }

    /**
     * Vai tratar os eventos dos botoes quando clicados
     */
    execBtn(value) {
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
                
                break;
            case 'ponto':
                this.addOperation('.');
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
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}