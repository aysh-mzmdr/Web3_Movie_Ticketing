// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketContract is ERC1155, Ownable{
    
    constructor() ERC1155("") Ownable(msg.sender) {}
    
    struct Movie{
        string imageURI;
        string title;
        string genre;
        string description;
        uint256 ticketPrice;
    }

    mapping(uint256 => Movie) public movies;

    enum seatStatus { Available, Taken, Occupied }

    struct Show{
        uint256 movieId;
        uint256 startTime;
        mapping(uint16 => seatStatus) seat;
        bool isActive;
    }

    mapping(uint256 => Show) public shows;

    struct Ticket{
        uint256 ticketId;
        uint256 showId;
        uint256 buyTime;
        uint16 seatNumber;
        address owner;
    }

    function addMovie(
        uint256 _movieId,
        string calldata _imageURI,
        string calldata _title,
        string calldata _genre,
        string calldata _description,
        uint256 _ticketPrice) external onlyOwner{
            movies[_movieId]=Movie(_imageURI, _title, _genre, _description,_ticketPrice);
    }

    function addShow(
        uint256 _showId,
        uint256 _movieId,
        uint256 _startTime,
        bool _isActive) external onlyOwner{
            Show storage newShow = shows[_showId];
            newShow.movieId=_movieId;
            newShow.startTime=_startTime;
            newShow.isActive=_isActive;
    }
}

// Show and Movie mappings. Show true, then display at frontend. Show contains seat matrix booked and vacant

// Ticket buying transaction, selling transaction, cancellation transaction, marketplace  





// Users: Admin, users, Theatre

// Admin: Add movies, add show, withdraw money
// User: Buy ticket, Sell Ticket, View seat matrix, view past tickets
// Theatre: Confirm user entry, Receive money