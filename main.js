class DOMHelper {
  static move(el, coordenadas) {
    //mvover el elemento al arrastralo con el mouse
    el.style.top = coordenadas.y - el.clientHeight / 2 + "px";
    el.style.left = coordenadas.x - el.clientWidth / 2 + "px";
  }

  static isOver(el, pointer) {
    let coordenadasEl = el.getBoundingClientRect();

    if (
      pointer.x > coordenadasEl.left &&
      pointer.x < coordenadasEl.left + coordenadasEl.width
    ) {
      if (
        pointer.y > coordenadasEl.top &&
        pointer.y < coordenadasEl.top + coordenadasEl.height
      ) {
        return true;
      }
    }
    return false;
  }

  static whereIs(el, pointer) {
    let coordenadasEl = el.getBoundingClientRect();

    if (
      pointer.x > coordenadasEl.left &&
      pointer.x < coordenadasEl.left + coordenadasEl.width
    ) {
      if (
        pointer.y > coordenadasEl.top &&
        pointer.y < coordenadasEl.top + coordenadasEl.height
      ) {
        if (pointer.y > coordenadasEl.top + coordenadasEl.height / 2) return 1;
        return 2;
      }
    }
    return -1;
  }
}

class DragList {
  constructor(s_list, s_items = "li") {
    this.list = document.querySelector(s_list);
    this.items = this.list.querySelectorAll(s_items);
    this.canvas = document.createElement("canvas");
    this.finalPosition = -1;
    this.finalElementHover = null;

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);

    this.buildFake();
    this.bindEvents();
  }

  buildFake() {
    this.fakeElement = document.createElement("div");
    this.fakeElement.style.background = "#cce";
    this.fakeElement.classList.add("card");

    //this.list.appendChild(this.fakeElement);
  }

  bindEvents() {
    this.items.forEach((item) => {
      item.addEventListener("dragstart", this.handleDragStart);
      item.addEventListener("drag", this.handleDrag);
      item.addEventListener("dragend", this.handleDragEnd);
    });
  }
  handleDragStart(ev) {
    let el = ev.currentTarget;
    ev.dataTransfer.setDragImage(this.canvas, 0, 0); //quitar sombra con hack de canvas
    el.classList.add("dragging");
  }
  handleDrag(ev) {
    let coordenadasMouse = { x: ev.clientX, y: ev.clientY };
    DOMHelper.move(ev.currentTarget, coordenadasMouse);

    if (DOMHelper.isOver(this.list, coordenadasMouse)) {
      this.items.forEach((item) =>
        this.compareElement(item, ev, coordenadasMouse)
      );
    } else {
      this.fakeElement.remove();
    }
  }

  compareElement(item, ev, coordenadasMouse) {
    if (item == ev.currentTarget) return;
    let result = DOMHelper.whereIs(item, coordenadasMouse);

    if (result == -1) return;
    this.finalPosition = result;
    this.finalElementHover = item;
    if (result == 1) this.list.insertBefore(this.fakeElement, item.nextSibling);

    if (result == 2) this.list.insertBefore(this.fakeElement, item);
  }

  handleDragEnd(ev) {
    let el = ev.currentTarget;
    el.classList.remove("dragging");
    el.style.top = "";
    el.style.left = "";

    if (this.finalPosition == 1)
      this.list.insertBefore(el, this.finalElementHover.nextSibling);

    if (this.finalPosition == 2)
      this.list.insertBefore(el, this.finalElementHover);
  }
}

(function () {
  new DragList("ul");
})();
