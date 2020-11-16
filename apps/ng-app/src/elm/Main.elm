port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)


port ngValueReceived : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    ngValueReceived NgValueReceived


type alias Model =
    String


init : () -> ( Model, Cmd Msg )
init _ =
    ( "", Cmd.none )


type Msg
    = NgValueReceived String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NgValueReceived value ->
            ( value, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "py-4" ]
        [ h1 [ class "text-xl font-bold" ]
            [ text "Elm is here!" ]
        , div []
            [ text model ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
