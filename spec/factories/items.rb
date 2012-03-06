# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :item do
    description "MyString"
    parent_id 1
    user_id 1
    details "MyString"
    recurring 1
    tags "MyString"
    location "MyString"
    priority "MyString"
    completion_status 1
    due_date "2012-03-05 20:38:21"
  end
end
