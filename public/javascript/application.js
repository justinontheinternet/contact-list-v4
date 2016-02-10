var Contacts = {

  getContacts: function() {
    //get JSON from /contacts, and then call Contacts.processContacts function
    $.getJSON('/contacts', Contacts.processContacts);
  },

  //data param is JSON data returned from server
  processContacts: function(data) {
    //retrieve and empty the table
    var table = $("#contacts").find('tbody').empty();
    //go through each contact in JSON data (can also look like $(data).each)
    $.each(data, function(index, contact){
      //append a tr element to the table
      var tr = $("<tr>").appendTo(table);
      //for each *index value* and *contact* (above), append a td to tr
      //(and by extension the tr to the table)
      $("<td>").attr('id', 'contact-name').text(contact.name).appendTo(tr);
      $("<td>").attr('id', 'contact-email').text(contact.email).appendTo(tr);
      $("<td>").attr('id', 'contact-number').text(contact.number).appendTo(tr);
      //set url value of each contact page
      var contactUrl = '/contact/' + contact.id;
      //add link with url and id attributes, append to td and that to tr
      $("<a>").attr('href', contactUrl).attr('id', contact.id ).text('delete').appendTo($("<td>").appendTo(tr));
      //must bind the click inside this function because the link
      //does not exist at document ready
      $('#' + contact.id).on('click', Contacts.deleteContact);

    });
    //remove the hide class from the table section
    $("#results").removeClass('hide');
  },

  addContact: function(event) {
    //prevent the button default method of 'get'
    event.preventDefault();
    //build a new contact, extracting the values from the input fields
    var newContact = {
      name: $('#name').val(),
      email: $('#email').val(),
      number: $('#number').val()
    };
    //post newContact to 'contacts/create', 
    //the attributes of newContact will be passed as params
    //call Contacts.addedContact upon successful save (in actions.rb)
    //'json' states the expected data type from the server
    $.post('/contacts/create', newContact, Contacts.addedContact, 'json');
  },

  addedContact: function(data) {
    // data is the response (now a json object) from /contacts/create in action.rb
    // if the value of data.result === true (from successful save)
    if (data.result){
      Contacts.getContacts();
    } else {
      alert("Something is wrong.");
    }
  },

  deleteContact: function(event) {
    event.preventDefault();
    var contact = {
      id: Number(this.id)
    }
    //there is no delete helper, so must call it manually
    //**note: dataType is what you receive, contentType is what you send
    $.ajax({
      url: '/contact/' + this.id,
      type: 'DELETE',
      success: Contacts.deleted,
      data: contact,
      dataType: 'json'
    });
  },

  deleted: function(data) {
    if (data.result){
      Contacts.getContacts();
    } else {
      alert("Not gonna happen.");
    }
  }
};

$(function() {
  $("#show_all").on('click', Contacts.getContacts);
  $("#show_form").on('click', function(){
    $("#new-contact").removeClass('hide');
  });
  $("#add_contact").on('click', Contacts.addContact);
});