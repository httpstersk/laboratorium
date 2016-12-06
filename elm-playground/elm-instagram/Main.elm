module Main exposing (..)

import PhotoView exposing (Photo, Comment)
import Html exposing (..)
import Html.Attributes exposing (class, src, width, height)
import Html.Events exposing (onClick)
import List exposing (repeat, map, append, take, length, drop)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { name : String
    , photoCount : Int
    , photos : List Photo
    , photoOpened : Maybe Photo
    , newComment : String
    }


initialModel =
    { name = "#unicorn"
    , photoCount = 1
    , photos = repeat 10 PhotoView.examplePhoto
    , photoOpened = Nothing
    , newComment = ""
    }


type Msg
    = OpenPhoto Photo
    | ClosePhoto



-- INIT


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OpenPhoto photo ->
            ( { model | photoOpened = Just photo }, Cmd.none )

        ClosePhoto ->
            ( { model | photoOpened = Nothing }, Cmd.none )



-- VIEW


photoGrid : List Photo -> Html Msg
photoGrid photos =
    photos
        |> List.map photoItem
        |> div [ class "photo-grid" ]


photoItem : Photo -> Html Msg
photoItem photo =
    div [ class "photo" ]
        [ img
            [ src photo.url
            , width 300
            , height 300
            , onClick (OpenPhoto photo)
            ]
            []
        ]


profileInfo : String -> Int -> Html Msg
profileInfo name photoCount =
    div [ class "profile-info" ]
        [ div [ class "name" ]
            [ text name ]
        , div [ class "count" ]
            [ span [ class "value" ]
                [ photoCount |> toString |> text ]
            , text " posts"
            ]
        ]


photoView : String -> Photo -> Html Msg
photoView newComment photoOpened =
    let
        model =
            { photo = photoOpened
            , newComment = newComment
            , showCloseButton = True
            }
    in
        model
            |> PhotoView.view
            |> Html.map (\_ -> ClosePhoto)


view : Model -> Html Msg
view model =
    let
        body =
            [ profileInfo model.name model.photoCount
            , photoGrid model.photos
            ]
    in
        case model.photoOpened of
            Nothing ->
                div [] body

            Just photoOpened ->
                photoOpened
                    |> photoView model.newComment
                    |> repeat 1
                    |> append body
                    |> div []



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
