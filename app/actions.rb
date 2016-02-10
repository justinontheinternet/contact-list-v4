# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  Contact.all.to_json
end

post '/contacts/create' do
  response = Hash.new
  response[:result] = false
  # grab the param info sent through the AJAX post
  contact = Contact.new(name: params[:name], email: params[:email], number: params[:number])

  if contact.save
    # if contact is saved to database, response hash will be changed
    response[:result] = true
    response[:id] = contact.id
  end
  # transform the response hash to a json object, to be sent "back"
  # to the post in application.js, to be used in the success function
  response.to_json
end

delete '/contact/:id' do
  # see above
  response = Hash.new
  response[:result] = false
  contact = Contact.find(params[:id])
  if contact.destroy
    response[:result] = true
  end
  response.to_json
end