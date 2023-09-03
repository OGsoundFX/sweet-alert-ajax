import { Controller } from "@hotwired/stimulus"
import Swal from "sweetalert2"

export default class extends Controller {
  static values = { 
    flatName: String
  }
  
  initSweetalert(event) {
    event.preventDefault();
    fetch(event.target.href, {headers: { "Accept": "text/plain" }})
      .then(response => response.text())
      .then((data) => {
        event.target.parentElement.outerHTML = data
      }).then(
        Swal.fire({
          icon: "success", 
          title: "Congratulations", 
          html: `<h3>Your booking for <strong style="color: #a5dc86">${this.flatNameValue}</strong> is confirmed</h3>`,
          showConfirmButton: false,
          timer: 1800
        })
      )
  }
}
