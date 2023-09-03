import { Controller } from "@hotwired/stimulus"
import Swal from "sweetalert2"

export default class extends Controller {
  static values = { 
    icon: String, 
    title: String, 
    html: String,
    confirmButtonText: String,
    showCancelButton: Boolean,
    cancelButtonText: String
  }
  
  initSweetalert(event) {
    event.preventDefault();
    console.log(event)
    Swal.fire({
      icon: this.iconValue, 
      title: this.titleValue, 
      html: this.htmlValue,
      footer: '<a href="/info">Need more information?</a>',
      confirmButtonText: this.confirmButtonTextValue, 
      showCancelButton: this.showCancelButtonValue, 
      cancelButtonText: this.cancelButtonTextValue, 
      reverseButtons: true
    }).then((action) => {
      if (action.isConfirmed) {
        fetch(event.target.href, {headers: { "Accept": "text/plain" }})
          .then(response => response.text())
          .then((data) => {
            event.target.parentElement.outerHTML = data
          })
      }
    }).catch(event.preventDefault())
  }
}
