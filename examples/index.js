import '../src/JQSelect';
import '../src/JQSelect.scss';

const data = [
    {
        'providerHotelCode': 'GOOGLE03',
        'id': 3,
        'hotelName': 'Test\u0027s 03'
    },
    {
        'providerHotelCode': 'GOOGLE19',
        'id': 101,
        'hotelName': 'google 19'
    },
    {
        'providerHotelCode': 'GOOGLE20',
        'id': 102,
        'hotelName': 'google 20'
    },
    {
        'providerHotelCode': 'GOOGLE21',
        'id': 103,
        'hotelName': 'google 21'
    },
    {
        'providerHotelCode': 'GOOGLE22',
        'id': 104,
        'hotelName': 'google 22'
    },
    {
        'providerHotelCode': 'GOOGLE23',
        'id': 105,
        'hotelName': 'google 23'
    },
    {
        'providerHotelCode': 'GOOGLE24',
        'id': 106,
        'hotelName': 'google 24'
    },
    {
        'providerHotelCode': 'GOOGLE25',
        'id': 107,
        'hotelName': 'google 25'
    },
    {
        'providerHotelCode': 'GOOGLE26',
        'id': 108,
        'hotelName': 'google 26'
    },
    {
        'providerHotelCode': 'GOOGLE27',
        'id': 109,
        'hotelName': 'google 27'
    }
];

$(function () {

    $('#example1').JQSelect({
        multi: true,
        enableFilter: true,
        enableSelectAll: true,
        data: data,
        valueField: 'id',
        displayField: 'hotelName',
        value: [3, 103]
    });

    // $('#example1').trigger('disable');

    $('#show-value-button').click(function () {
        console.log($('#example1').val());
    });

});