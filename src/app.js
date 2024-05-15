document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpeg", price: 20000 },
      { id: 2, name: "Arabica Blend", img: "2.jpeg", price: 20000 },
      { id: 3, name: "Primo Passo", img: "3.jpeg", price: 20000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpeg", price: 20000 },
      { id: 5, name: "Sumatra Mandheling", img: "5.jpeg", price: 20000 },
    ],
  }));
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      //jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //Jika Barang Sudah Ada, Cek Apakah Barang Beda Atau Sama Dengan Yang ada Di Cart
        this.items = this.items.map((item) => {
          //Jika Barang Berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //Jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      //ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);
      //Jika Item Lebih Dari 1
      if (cartItem.quantity > 1) {
        //Jika bukan barang diklik
        if (item.id !== id) {
          return item;
        } else {
          item.quantity--;
          item.total = item.price * item.quantity;
          this.quantity--;
          this.total -= item.price;
          return item;
        }
      } else if (cartItem.quantity === 1) {
        //Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});
//Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;
const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});
//kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = object.fromEntries(data);
  const message = formatMessage(objdata);
  // window.open(
  //   "http://wa.me/62881010930936?text=" + encodeURIComponent(message)
  // );
  try {
    const response = await fetch("php/placeOrder", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    console.log(token);
    // window.snap.pay("TRANSACTION_TOKEN_HERE");
  } catch (err) {
    console.log(err.message);
  }
});
//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama:${obj.name}
  Email:${obj.email}
  No. HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name}(${item.quantity} x ${rupiah(item.total)})\n`
  )}
  TOTAL : ${rupiah(obj.total)}
  Terima Kasih.
  `;
};
//konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
