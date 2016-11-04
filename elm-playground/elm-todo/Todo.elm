module Main exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Html.App as App


main =
    App.beginnerProgram
        { model = model
        , view = view
        , update = update
        }



-- MODEL


type alias Model =
    { todo : String
    , todos : List String
    }


model : Model
model =
    { todo = ""
    , todos = []
    }



-- UPDATE


stylesheet =
    let
        tag =
            "link"

        attrs =
            [ attribute "Rel" "stylesheet"
            , attribute "property" "stylesheet"
            , attribute "href" ""
            ]

        children =
            []
    in
        node tag attrs children


type Msg
    = UpdateTodo String
    | AddTodo
    | RemoveAll
    | RemoveItem String
    | ClearInput


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateTodo text ->
            { model | todo = text }

        AddTodo ->
            { model | todos = model.todo :: model.todos }

        RemoveAll ->
            { model | todos = [] }

        RemoveItem text ->
            { model | todos = List.filter (\x -> x /= text) model.todos }

        ClearInput ->
            { model | todo = "" }



-- VIEW


todoItem : String -> Html Msg
todoItem todo =
    li []
        [ text todo
        , button [ onClick (RemoveItem todo) ] [ text "×" ]
        ]


todoList : List String -> Html Msg
todoList todos =
    let
        child =
            List.map todoItem todos
    in
        ul [] child


view : Model -> Html Msg
view model =
    div []
        [ stylesheet
        , input
            [ type' "text"
            , onInput UpdateTodo
            , value model.todo
            , onMouseEnter ClearInput
            ]
            []
        , button [ onClick AddTodo ] [ text "Submit" ]
        , button [ onClick RemoveAll ] [ text "Remove All" ]
        , div [] [ todoList model.todos ]
        ]
