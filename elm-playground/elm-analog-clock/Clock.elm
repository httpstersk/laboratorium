module Main exposing (..)

import Html exposing (Html)
import Html.App as App
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Time exposing (Time, millisecond, second)


main =
    App.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    Time


init : ( Model, Cmd Msg )
init =
    ( 0, Cmd.none )



-- UPDATE


type Msg
    = Tick Time


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick newTime ->
            ( newTime, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every second Tick



-- VIEW


secondHand model =
    let
        angle =
            turns (Time.inMinutes model)

        handX =
            toString (50 + 40 * cos angle)

        handY =
            toString (50 + 40 * sin angle)
    in
        line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "black" ] []


minuteHand model =
    let
        angle =
            degrees (toFloat ((floor (Time.inMinutes model) % 60) * 6) - 90)

        handX =
            toString (50 + 33 * cos angle)

        handY =
            toString (50 + 33 * sin angle)
    in
        line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "black", strokeWidth "3px" ] []


hourHand model =
    let
        angle =
            degrees (toFloat ((floor (Time.inMinutes model) % 12) * 30) - 90)

        handX =
            toString (50 + 25 * cos angle)

        handY =
            toString (50 + 25 * sin angle)
    in
        line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "black", strokeWidth "2px" ] []


view : Model -> Html Msg
view model =
    svg [ viewBox "0 0 100 100", width "100px" ]
        [ circle [ cx "50", cy "50", r "45", fill "tomato" ] []
        , secondHand model
        , minuteHand model
        , hourHand model
        ]
