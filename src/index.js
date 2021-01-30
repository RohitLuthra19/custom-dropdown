import KEY_CODES from "./constants";
const template = document.createElement("template");

template.innerHTML = `
  <style>
  .dropdown {
    display: flex;
    align-items: center;
  }
  .dropdown-list {
    display: none;
  }

  .dropdown.open .dropdown-list {
    display: flex;
    flex-direction: column;
  }

  [role="listbox"] {
    min-height: 3.6em;
    padding: 0;
    background: white;
    border: 1px solid #aaa;
  }
  
  [role="option"] {
    display: block;
    padding: 0 1em 0 1.5em;
    position: relative;
    line-height: 1.8em;
  }
  
  [role="option"].focused {
    background: #bde4ff;
  }
  
  [role="option"][aria-selected="true"] {
    background: #bde4ff;
  }
    
  button {
    font-size: 16px;
  }

  button[aria-disabled="true"] {
    opacity: 0.5;
  }

  #dropdown_button {
    border-radius: 0;
    font-size: 16px;
    text-align: left;
    padding: 5px 10px;
    width: 150px;
    position: relative;
  }
  
  #dropdown_button::after {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #aaa;
    content: " ";
    position: absolute;
    right: 5px;
    top: 10px;
  }
  
  #dropdown_button[aria-expanded="true"]::after {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 0;
    border-bottom: 8px solid #aaa;
    content: " ";
    position: absolute;
    right: 5px;
    top: 10px;
  }
  
  #dropdown_elem_list {
    border-top: 0;
    max-height: 10em;
    overflow-y: auto;
    position: absolute;
    margin: 0;
    width: 148px;
  }

  .dropdown-wrapper {
    box-sizing: border-box;
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    width: 50%;
  }

  </style>

  <div class="dropdown">
  <span id="dropdown_elem" class="label">Label</span>

  <div class="dropdown-wrapper">
    <button
      aria-haspopup="listbox"
      aria-labelledby="dropdown_elem dropdown_button"
      id="dropdown_button"
    >
      Select Country
    </button>

    <ul
      id="dropdown_elem_list"
      class="dropdown-list"
      role="listbox"
      aria-labelledby="dropdown_elem"
    ></ul>

</div>

`;

class CustomDropdown extends HTMLElement {
  constructor() {
    super();

    // optional: Attach Shadow DOM to the component
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$label = this.shadowRoot.querySelector(".label");
    this.$button = this.shadowRoot.querySelector("button");
    this.$dropdown = this.shadowRoot.querySelector(".dropdown");
    this.$dropdownList = this.shadowRoot.querySelector(".dropdown-list");

    this.open = false;
  }
  // define the observedAttributes array
  static get observedAttributes() {
    return [
      "label",
      "defaultOption",
      "id",
      "name",
      "disabled",
      "placeholder",
      "options",
    ];
  }

  connectedCallback() {
    console.log(
      "componentDidMount: Invoked when the custom element is first connected to the document's DOM"
    );
    this.$button.addEventListener("click", this.onButtonClick.bind(this));
    this.$button.addEventListener("keyup", this.onKeyUp.bind(this));
  }
  disconnectedCallback() {
    console.log(
      "componentWillUnmount: Invoked when the custom element is disconnected from the document's DOM"
    );
    this.$button.removeEventListener("click", this.onButtonClick.bind(this));
    this.$button.removeEventListener("keyup", this.onKeyUp.bind(this));
  }

  adoptedCallback() {
    console.log("Invoked when the custom element is moved to a new document");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "Invoked when one of the custom element's attributes is added, removed, or changed"
    );
    this.render();
  }

  onKeyUp(event) {
    const key = event.which || event.keyCode;

    switch (key) {
      case KEY_CODES.UP:
      case KEY_CODES.DOWN:
        evt.preventDefault();
        this.onButtonClick();
        break;
    }
  }
  /**
   * On Dropdown Click
   */
  onButtonClick() {
    console.log("Button clicked");
    this.open = !this.open;

    this.$dropdownListItem = this.shadowRoot.querySelector("li");

    this.open ? this.setOpenState() : this.setCloseState();
  }

  setOpenState() {
    this.$button.setAttribute("aria-expanded", "true");
    this.$dropdown.classList.add("open");
    this.$dropdownList.setAttribute(
      "aria-activedescendant",
      this.$dropdownListItem.id
    );
    this.$dropdownListItem.setAttribute("aria-selected", "true");
  }

  setCloseState() {
    this.$button.removeAttribute("aria-expanded");
    this.$dropdown.classList.remove("open");
    this.$dropdownList.removeAttribute("aria-activedescendant");
    this.$dropdownListItem.removeAttribute("aria-selected");
  }

  /**
   * Getter/Setter methods
   */
  get label() {
    return this.getAttribute("label");
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get defaultOption() {
    return this.getAttribute("defaultOption");
  }

  set defaultOption(value) {
    this.setAttribute("defaultOption", value);
  }

  get id() {
    return this.getAttribute("id");
  }

  set id(value) {
    this.setAttribute("id", value);
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }

  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }

  get disabled() {
    return this.getAttribute("disabled");
  }

  set disabled(value) {
    this.setAttribute("disabled", value);
  }

  get options() {
    return JSON.parse(this.getAttribute("options"));
  }

  set options(value) {
    this.setAttribute("options", JSON.stringify(value));
  }

  render() {
    this.$label.innerHTML = this.label;

    //Setting defaultOption as button text if available
    if (this.options && this.defaultOption) {
      this.$button.innerHTML = this.options[this.defaultOption].label;
    }

    this.$dropdownList.innerHTML = "";

    //Setting options as list item(li)
    Object.keys(this.options || {}).forEach((key) => {
      let option = this.options[key];
      let $option = document.createElement("li");

      $option.innerHTML = option.label;
      $option.setAttribute("role", "option");
      $option.setAttribute("id", `dropdown_elem_${option.label}`);

      //$option.classList.add("");

      if (this.option && this.option === key) {
        $option.classList.add("selected");
      }

      $option.addEventListener("click", () => {
        this.option = key;

        this.onButtonClick();

        this.dispatchEvent(new CustomEvent("onChange", { detail: key }));

        this.render();
      });

      this.$dropdownList.appendChild($option);
    });
  }
}

customElements.define("custom-dropdown", CustomDropdown);
