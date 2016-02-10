require 'faker'

Contact.destroy_all

10.times do
  contact = Contact.new
  contact.name = Faker::Name.name
  contact.email = Faker::Internet.email
  contact.number = Faker::PhoneNumber.phone_number
  contact.save
end