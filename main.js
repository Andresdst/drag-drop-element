class DOMHelper {
  static move(el, coordenadas) {
    //mvover el elemento al arrastralo con el mouse
    el.style.top = coordenadas.y - el.clientHeight / 2 + "px";
    el.style.left = coordenadas.x - el.clientWidth / 2 + "px";
  }
}

class DragList {
  constructor(s_list, s_items = "li") {
    this.list = document.querySelector(s_list);
    this.items = this.list.querySelectorAll(s_items);
    this.canvas = document.createElement("canvas");

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);

    this.bindEvents();
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
    DOMHelper.move(ev.currentTarget, { x: ev.clientX, y: ev.clientY });
  }

  handleDragEnd(ev) {
    let el = ev.currentTarget;
    el.style.top = "";
    el.style.left = "";

    el.classList.remove("dragging");
  }
}

(function () {
  new DragList("ul");
})();
